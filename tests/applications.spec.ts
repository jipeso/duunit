import { test, expect } from '@playwright/test'
import { createUser, loginFromUi, resetDatabase } from './helpers.ts'

const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'Password123?'

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
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginFromUi(page, TEST_EMAIL, TEST_PASSWORD)
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

      await page.getByTestId('application-company').fill('A')
      await page.getByTestId('application-position').fill('B')
      await page.getByTestId('application-applied-at').fill('2009-12-31')
      await page.getByTestId('application-job-posting-url').fill('not-a-url')
      await page.getByTestId('application-submit').click()

      await expect(page).toHaveURL('/applications/new')
      await expect(
        page.getByText('Company must be at least 2 characters long')
      ).toBeVisible()
      await expect(
        page.getByText('Position must be at least 2 characters long')
      ).toBeVisible()
      await expect(page.getByText(/Applied on must be after/)).toBeVisible()
      await expect(page.getByText('Job posting URL is invalid')).toBeVisible()
    })
  })
})
