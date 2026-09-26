import { test, expect } from '@playwright/test'
import { createUser, resetDatabase } from './helpers.ts'

test.describe('Authentication', () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test.describe('Registration', () => {
    test('user can register with valid data', async ({ page }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill('Password123?')
      await page.getByTestId('register-confirm-password').fill('Password123?')
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/login')
      await expect(
        page.getByText('Your account has been created.')
      ).toBeVisible()
    })

    test('registration fails with short name', async ({ page }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('T')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill('Password123?')
      await page.getByTestId('register-confirm-password').fill('Password123?')
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('Name must be at least 4 characters long')
      ).toBeVisible()
    })

    test('registration fails with long name', async ({ page }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('T'.repeat(33))
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill('Password123?')
      await page.getByTestId('register-confirm-password').fill('Password123?')
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
      await page.getByTestId('register-password').fill('Password123?')
      await page.getByTestId('register-confirm-password').fill('Password123?')
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('Please enter a valid email address')
      ).toBeVisible()
    })

    test('registration fails with too short password', async ({ page }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill('P123!')
      await page.getByTestId('register-confirm-password').fill('P123!')
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('Password must be at least 8 characters long')
      ).toBeVisible()
    })

    test('registration fails with too long password', async ({ page }) => {
      await page.goto('/register')

      // 27 characters, which exceeds the 24 character maximum.
      const tooLongPassword = `Password123?${'a'.repeat(15)}`

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill(tooLongPassword)
      await page.getByTestId('register-confirm-password').fill(tooLongPassword)
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('Password must be at most 24 characters long')
      ).toBeVisible()
    })

    test('registration fails without a lowercase letter in password', async ({
      page,
    }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill('PASSWORD123?')
      await page.getByTestId('register-confirm-password').fill('PASSWORD123?')
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('Password must contain at least one lowercase letter')
      ).toBeVisible()
    })

    test('registration fails without an uppercase letter in password', async ({
      page,
    }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill('password123?')
      await page.getByTestId('register-confirm-password').fill('password123?')
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('Password must contain at least one uppercase letter')
      ).toBeVisible()
    })

    test('registration fails without a number in password', async ({
      page,
    }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill('Password??')
      await page.getByTestId('register-confirm-password').fill('Password??')
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('Password must contain at least one number')
      ).toBeVisible()
    })

    test('registration fails without a special character in password', async ({
      page,
    }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill('Password123')
      await page.getByTestId('register-confirm-password').fill('Password123')
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('Password must contain at least one special character')
      ).toBeVisible()
    })

    test('registration fails with mismatched passwords', async ({ page }) => {
      await page.goto('/register')

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill('Password123?')
      await page.getByTestId('register-confirm-password').fill('Password123!')
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(page.getByText('Passwords do not match')).toBeVisible()
    })

    test('registration fails when the email is already in use', async ({
      page,
    }) => {
      await createUser('Existing User', 'test@example.com', 'Password123?')

      await page.goto('/register')

      await page.getByTestId('register-name').fill('Test User')
      await page.getByTestId('register-email').fill('test@example.com')
      await page.getByTestId('register-password').fill('Password123?')
      await page.getByTestId('register-confirm-password').fill('Password123?')
      await page.getByTestId('register-submit').click()

      await expect(page).toHaveURL('/register')
      await expect(
        page.getByText('That email address is already in use.')
      ).toBeVisible()
    })
  })

  test.describe('Login', () => {
    test('user can login with valid credentials', async ({ page }) => {
      await createUser('Test User', 'test@example.com', 'Password123?')

      await page.goto('/login')

      await page.getByTestId('login-email').fill('test@example.com')
      await page.getByTestId('login-password').fill('Password123?')
      await page.getByTestId('login-submit').click()

      await expect(page).toHaveURL('/')
      await expect(page.getByText('You are now logged in.')).toBeVisible()
    })

    test('login fails with invalid credentials', async ({ page }) => {
      await createUser('Test User', 'test@example.com', 'Password123?')

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
      await expect(page.getByText('Please enter your email')).toBeVisible()
      await expect(page.getByText('Please enter your password')).toBeVisible()
    })
  })

  test.describe('Logout', () => {
    test('user can log out', async ({ page }) => {
      await createUser('Test User', 'test@example.com', 'Password123?')

      await page.goto('/login')
      await page.getByTestId('login-email').fill('test@example.com')
      await page.getByTestId('login-password').fill('Password123?')
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
      await createUser('Test User', 'test@example.com', 'Password123?')

      await page.goto('/login')
      await page.getByTestId('login-email').fill('test@example.com')
      await page.getByTestId('login-password').fill('Password123?')
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
