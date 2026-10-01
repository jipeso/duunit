import axios from 'axios'
import { type Page } from '@playwright/test'

const baseUrl = 'http://localhost:3000'

export const resetDatabase = async () => {
  await axios.delete(`${baseUrl}/test/reset`)
}

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await axios.post(`${baseUrl}/api/auth/sign-up/email`, {
    email,
    name,
    password,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.data
}

export const loginWith = async (
  page: Page,
  email: string,
  password: string
) => {
  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit').click()
}

export const createApplication = async (
  page: Page,
  company: string,
  position: string,
  location?: string
) => {
  await page.getByRole('link', { name: 'Add a new application' }).click()
  await page.getByTestId('application-company').fill(company)
  await page.getByTestId('application-position').fill(position)
  if (location) {
    await page.getByTestId('application-location').fill(location)
  }
  await page.getByRole('button', { name: 'Create' }).click()
  await page.getByText('My applications').waitFor()
}
