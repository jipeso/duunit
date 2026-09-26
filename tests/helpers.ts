import axios from 'axios'

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
