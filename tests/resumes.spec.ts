import { test, expect } from '@playwright/test'
import { createUser, loginWith, resetDatabase } from './helpers.ts'

const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'joku erinomainen salasana'

test.describe('Resumes', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase()
    await createUser('Test User', TEST_EMAIL, TEST_PASSWORD)
    await page.goto('/login')
    await loginWith(page, TEST_EMAIL, TEST_PASSWORD)
    await expect(page).toHaveURL('/')
  })

  test('user can upload a resume', async ({ page }) => {
    await page.goto('/resumes')
    await page.getByTestId('resume-upload').setInputFiles({
      name: 'resume.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n%%EOF\n'),
    })

    await expect(page.getByText('Resume has been uploaded')).toBeVisible()
    await expect(page.getByText('resume.pdf')).toBeVisible()
  })

  test('user can open a resume', async ({ page }) => {
    await page.goto('/resumes')
    await page.getByTestId('resume-upload').setInputFiles({
      name: 'resume.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n%%EOF\n'),
    })
    await page.getByText('resume.pdf').click()

    await expect(page).toHaveURL(/\/resumes\/[\w-]+$/)
    await expect(
      page.getByRole('heading', { name: 'resume.pdf' })
    ).toBeVisible()
  })
})
