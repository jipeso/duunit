import { test, expect } from '@playwright/test'
import { createUser, resetDatabase } from './helpers.ts'

const TEST_PASSWORD = 'joku erinomainen salasana'

test.describe('Authentication', () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test.describe('Registration', () => {
    test('user can register with valid data', async ({ page }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill(TEST_PASSWORD)
      await page.getByTestId('register-confirm-password').fill(TEST_PASSWORD)
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/')
      await expect(
        page.getByText('Your account has been created.')
      ).toBeVisible()
    })

    test('registration fails with short name', async ({ page }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('T')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill(TEST_PASSWORD)
      await page.getByTestId('register-confirm-password').fill(TEST_PASSWORD)
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('Name must be at least 2 characters long')
      ).toBeVisible()
    })

    test('registration fails with long name', async ({ page }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('T'.repeat(33))
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill(TEST_PASSWORD)
      await page.getByTestId('register-confirm-password').fill(TEST_PASSWORD)
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('Name must be at most 32 characters long')
      ).toBeVisible()
    })

    test('registration fails with invalid email', async ({ page }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('invalid-email')
      await page.getByTestId('register-password').fill(TEST_PASSWORD)
      await page.getByTestId('register-confirm-password').fill(TEST_PASSWORD)
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(page.getByText('Email is invalid')).toBeVisible()
    })

    test('registration fails with too short password', async ({ page }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill('a'.repeat(14))
      await page.getByTestId('register-confirm-password').fill('a'.repeat(14))
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('Password must be at least 15 characters long')
      ).toBeVisible()
    })

    test('registration fails with too long password', async ({ page }) => {
      await page.goto('/register')

      const tooLongPassword = 'a'.repeat(65)

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill(tooLongPassword)
      await page.getByTestId('register-confirm-password').fill(tooLongPassword)
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('Password must be at most 64 characters long')
      ).toBeVisible()
    })

    test('registration fails with mismatched passwords', async ({ page }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill(TEST_PASSWORD)
      await page
        .getByTestId('register-confirm-password')
        .fill(`${TEST_PASSWORD}!`)
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(page.getByText('Passwords do not match')).toBeVisible()
    })

    test('registration fails when the email is already in use', async ({
      page,
    }) => {
      await createUser('Existing User', 'test@example.com', TEST_PASSWORD)

      await page.goto('/register')

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill(TEST_PASSWORD)
      await page.getByTestId('register-confirm-password').fill(TEST_PASSWORD)
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('That email address is already in use.')
      ).toBeVisible()
    })
  })

  test.describe('Login', () => {
    test('user can login with valid credentials', async ({ page }) => {
      await createUser('Test User', 'test@example.com', TEST_PASSWORD)

      await page.goto('/login')

      await page.getByTestId('login-email').fill('test@example.com')
      await page.getByTestId('login-password').fill(TEST_PASSWORD)
      await page.getByTestId('login-submit').click()

      await expect(page).toHaveURL('/')
      await expect(page.getByText('You are now logged in.')).toBeVisible()
    })

    test('login fails with invalid credentials', async ({ page }) => {
      await createUser('Test User', 'test@example.com', TEST_PASSWORD)

      await page.goto('/login')

      await page.getByTestId('login-email').fill('test@example.com')
      await page.getByTestId('login-password').fill('WrongPassword123?')
      await page.getByTestId('login-submit').click()

      await expect(page).toHaveURL('/login')
      await expect(page.getByText('Invalid email or password.')).toBeVisible()
    })

    test('login shows required errors when submitted empty', async ({
      page,
    }) => {
      await page.goto('/login')

      await page.getByTestId('login-submit').click()

      await expect(page).toHaveURL('/login')
      await expect(page.getByText('Email is required')).toBeVisible()
      await expect(page.getByText('Password is required')).toBeVisible()
    })
  })

  test.describe('Logout', () => {
    test('user can log out', async ({ page }) => {
      await createUser('Test User', 'test@example.com', TEST_PASSWORD)

      await page.goto('/login')
      await page.getByTestId('login-email').fill('test@example.com')
      await page.getByTestId('login-password').fill(TEST_PASSWORD)
      await page.getByTestId('login-submit').click()
      await expect(page).toHaveURL('/')

      await page.getByRole('button', { name: 'Settings' }).click()
      await page.getByRole('button', { name: 'Logout' }).click()

      await expect(page.getByText('You have been logged out.')).toBeVisible()
      await expect(page.getByRole('link', { name: 'Login' })).toBeVisible()
    })
  })

  test.describe('Guest routes', () => {
    test('logged in user is redirected away from login and register', async ({
      page,
    }) => {
      await createUser('Test User', 'test@example.com', TEST_PASSWORD)

      await page.goto('/login')
      await page.getByTestId('login-email').fill('test@example.com')
      await page.getByTestId('login-password').fill(TEST_PASSWORD)
      await page.getByTestId('login-submit').click()
      await expect(page).toHaveURL('/')

      await page.goto('/login')
      await expect(page).toHaveURL('/')

      await page.goto('/register')
      await expect(page).toHaveURL('/')
    })
  })

  test.describe('Protected routes', () => {
    test('anonymous user is redirected away from protected routes', async ({
      page,
    }) => {
      await page.goto('/profile')
      await expect(page).toHaveURL('/')

      await page.goto('/admin')
      await expect(page).toHaveURL('/')
    })
  })
})
