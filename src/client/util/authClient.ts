import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'

import queryClient from './queryClient'
import { ROLES } from '#common/types/users.ts'

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: { role: { type: [...ROLES], input: false } },
    }),
  ],
})

export const signOut = async () => {
  await authClient.signOut()
  queryClient.clear()
}
