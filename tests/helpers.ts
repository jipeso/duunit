import axios from 'axios'
import { type Page, expect } from '@playwright/test'

const baseUrl = 'http://localhost:3000'

export const resetDatabase = async () => {
  await axios.delete(`${baseUrl}/test/reset`)
}

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await axios.post(`${baseUrl}/api/users`, {
    email,
    name,
    password,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.data
}

export const loginFromUi = async (
  page: Page,
  email: string,
  password: string
) => {
  await page.goto('/login')
  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit').click()
  await expect(page).toHaveURL('/')
}
