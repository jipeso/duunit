import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'

import { ROLES } from '#common/types/users.ts'

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: { role: { type: [...ROLES], input: false } },
    }),
  ],
})
