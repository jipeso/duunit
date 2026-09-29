import { createTheme } from '@mui/material/styles'
import { enUS, fiFI, svSE } from '@mui/material/locale'
import {
  enUS as dataGridEnUS,
  fiFI as dataGridFiFI,
  svSE as dataGridSvSE,
} from '@mui/x-data-grid/locales'

import type { LanguageId } from '#common/types/common.ts'

const muiLocales = {
  en: enUS,
  fi: fiFI,
  sv: svSE,
} satisfies Record<LanguageId, typeof enUS>

const dataGridLocales = {
  en: dataGridEnUS,
  fi: dataGridFiFI,
  sv: dataGridSvSE,
} satisfies Record<LanguageId, typeof dataGridEnUS>

const bodyFontFamily = '"Instrument Sans", system-ui, sans-serif'
const headingFontFamily = '"Bricolage Grotesque", sans-serif'

const ink = '#12151C'
const coral = '#E8895E'

export const createAppTheme = (language: LanguageId) =>
  createTheme(
    {
      cssVariables: { colorSchemeSelector: 'data' },

      colorSchemes: {
        light: {
          palette: {
            primary: {
              main: '#A8481F',
              contrastText: '#FFFFFF',
            },
            secondary: {
              main: '#5B6478',
            },
            background: {
              default: '#F6F3EF',
              paper: '#FFFFFF',
            },
            text: {
              primary: ink,
            },
          },
        },

        dark: {
          palette: {
            primary: {
              main: coral,
              contrastText: ink,
            },
            secondary: {
              main: '#9AA3B8',
            },
            background: {
              default: ink,
              paper: '#1A1E27',
            },
          },
        },
      },

      shape: {
        borderRadius: 8,
      },

      typography: {
        fontFamily: bodyFontFamily,

        h1: {
          fontFamily: headingFontFamily,
          fontWeight: 700,
        },

        h2: {
          fontFamily: headingFontFamily,
          fontWeight: 700,
        },

        h3: {
          fontFamily: headingFontFamily,
          fontWeight: 700,
        },

        button: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },

      components: {
        MuiButton: {
          defaultProps: {
            disableElevation: true,
          },
        },

        MuiCard: {
          defaultProps: {
            variant: 'outlined',
          },
        },

        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
      },
    },
    dataGridLocales[language],
    muiLocales[language]
  )
