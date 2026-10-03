import { test, expect } from '@playwright/test'
import {
  createApplication,
  createUser,
  loginWith,
  resetDatabase,
} from './helpers.ts'

const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'joku erinomainen salasana'
const OTHER_EMAIL = 'other@example.com'
const MISSING_ID = '00000000-0000-4000-8000-000000000000'
const UPDATE_BODY = {
  company: 'Hijacked company',
  position: 'Hijacked position',
  status: 'applied',
}

test.describe('Applications', () => {
  test.beforeEach(async () => {
    await resetDatabase()
    await createUser('Test User', TEST_EMAIL, TEST_PASSWORD)
  })

  test('guest user is redirected away from application pages', async ({
    page,
  }) => {
    await page.goto('/applications')
    await expect(page).toHaveURL('/')

    await page.goto('/applications/new')
    await expect(page).toHaveURL('/')

    await page.goto(`/applications/${MISSING_ID}/edit`)
    await expect(page).toHaveURL('/')
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login')
      await loginWith(page, TEST_EMAIL, TEST_PASSWORD)
      await expect(page).toHaveURL('/')
    })

    test('user without applications sees the empty state', async ({ page }) => {
      await page.goto('/applications')

      await expect(
        page.getByText('You have not added any applications yet')
      ).toBeVisible()
    })

    test('user can register a job application', async ({ page }) => {
      await page.goto('/applications/new')

      await page.getByTestId('application-company').fill('Test company')
      await page.getByTestId('application-position').fill('Test Developer')
      await page.getByTestId('application-applied-at').fill('2026-01-01')
      await page
        .getByTestId('application-job-posting-url')
        .fill('https://example.com')
      await page.getByTestId('application-location').fill('Helsinki')
      await page.getByTestId('application-submit').click()

      await expect(page).toHaveURL('/applications')
      await expect(
        page.getByText('New application has been added')
      ).toBeVisible()

      const row = page.getByRole('row', { name: /Test company/ })
      await expect(row).toBeVisible()
      await expect(row.getByText('Test Developer')).toBeVisible()
      await expect(row.getByText('Helsinki')).toBeVisible()
      await expect(row.getByText('Applied', { exact: true })).toBeVisible()
    })

    test('application form shows validation errors', async ({ page }) => {
      await page.goto('/applications/new')

      await page.getByTestId('application-applied-at').fill('2009-12-31')
      await page.getByTestId('application-job-posting-url').fill('not-a-url')
      await page.getByTestId('application-submit').click()

      await expect(page).toHaveURL('/applications/new')
      await expect(page.getByText('Company is required')).toBeVisible()
      await expect(page.getByText('Position is required')).toBeVisible()
      await expect(page.getByText(/Applied on must be after/)).toBeVisible()
      await expect(page.getByText('Job posting URL is invalid')).toBeVisible()
    })

    test('user can edit an application', async ({ page }) => {
      await page.goto('/applications')
      await createApplication(page, 'Test company', 'Test Developer')

      await page
        .getByRole('row', { name: /Test company/ })
        .getByTestId('application-edit')
        .click()
      await expect(page).toHaveURL(/\/applications\/.+\/edit$/)

      await expect(page.getByTestId('application-company')).toHaveValue(
        'Test company'
      )
      await expect(page.getByTestId('application-location')).toHaveValue('')

      await page.getByTestId('application-position').fill('Senior Developer')
      await page.getByRole('combobox', { name: /Status/ }).click()
      await page.getByRole('option', { name: 'Interviewing' }).click()
      await page.getByTestId('application-location').fill('Helsinki')
      await page.getByTestId('application-submit').click()

      await expect(page).toHaveURL('/applications')
      await expect(page.getByText('Application has been updated')).toBeVisible()

      const row = page.getByRole('row', { name: /Test company/ })
      await expect(row.getByText('Senior Developer')).toBeVisible()
      await expect(row.getByText('Interviewing')).toBeVisible()
      await expect(row.getByText('Helsinki')).toBeVisible()
    })

    test('user can clear an optional field when editing', async ({ page }) => {
      await page.goto('/applications')
      await createApplication(
        page,
        'Test company',
        'Test Developer',
        'Helsinki'
      )

      const row = page.getByRole('row', { name: /Test company/ })
      await expect(row.getByText('Helsinki')).toBeVisible()

      await row.getByTestId('application-edit').click()
      await expect(page.getByTestId('application-location')).toHaveValue(
        'Helsinki'
      )
      await page.getByTestId('application-location').clear()
      await page.getByTestId('application-submit').click()

      await expect(page).toHaveURL('/applications')
      await expect(row.getByText('Helsinki')).toBeHidden()
      await expect(row.getByText('—')).toBeVisible()
    })

    test('user can change the status from the grid', async ({ page }) => {
      await page.goto('/applications')
      await createApplication(page, 'Test company', 'Test Developer')

      const row = page.getByRole('row', { name: /Test company/ })
      await row.getByText('Applied').click()
      await page.getByRole('option', { name: 'Interviewing' }).click()

      await expect(page.getByText('Application has been updated')).toBeVisible()
      await expect(row.getByText('Interviewing')).toBeVisible()

      await page.reload()
      await expect(
        page
          .getByRole('row', { name: /Test company/ })
          .getByText('Interviewing')
      ).toBeVisible()
    })

    test('patching only the status keeps other fields', async ({ page }) => {
      await page.goto('/applications')
      await createApplication(
        page,
        'Test company',
        'Test Developer',
        'Helsinki'
      )

      const listResponse = await page.request.get('/api/applications')
      const [application] = await listResponse.json()

      const response = await page.request.patch(
        `/api/applications/${application.id}`,
        { data: { status: 'offer' } }
      )
      expect(response.status()).toBe(200)
      expect(await response.json()).toMatchObject({
        company: 'Test company',
        position: 'Test Developer',
        location: 'Helsinki',
        status: 'offer',
      })

      const emptyResponse = await page.request.patch(
        `/api/applications/${application.id}`,
        { data: {} }
      )
      expect(emptyResponse.status()).toBe(400)
    })

    test('editing a missing application shows not found', async ({ page }) => {
      await page.goto(`/applications/${MISSING_ID}/edit`)

      await expect(page.getByText('Application not found')).toBeVisible()
      await expect(page.getByTestId('application-submit')).toBeHidden()
    })

    test('user can cancel deleting an application', async ({ page }) => {
      await page.goto('/applications')
      await createApplication(page, 'Test company', 'Test Developer')

      const row = page.getByRole('row', { name: /Test company/ })
      await row.getByTestId('application-delete').click()

      const dialog = page.getByRole('dialog')
      await expect(
        dialog.getByText(
          'Delete the application for Test Developer at Test company?'
        )
      ).toBeVisible()
      await dialog.getByTestId('confirm-dialog-cancel').click()

      await expect(dialog).toBeHidden()
      await expect(row).toBeVisible()
    })

    test('user can delete an application', async ({ page }) => {
      await page.goto('/applications')
      await createApplication(page, 'Test company', 'Test Developer')

      await page
        .getByRole('row', { name: /Test company/ })
        .getByTestId('application-delete')
        .click()
      await page.getByTestId('confirm-dialog-confirm').click()

      await expect(page.getByText('Application has been deleted')).toBeVisible()
      await expect(
        page.getByText('You have not added any applications yet')
      ).toBeVisible()
    })
  })
})
