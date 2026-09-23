import { createTheme } from '@mui/material/styles'
import { enUS, fiFI, svSE } from '@mui/material/locale'

import type { LanguageId } from '#common/types/common.ts'

const locales = {
  en: enUS,
  fi: fiFI,
  sv: svSE,
}

export const createAppTheme = (language: LanguageId) => {
  const theme = createTheme(
    {
      colorSchemes: {
        dark: true,
      },
    },
    locales[language]
  )
  return theme
}
