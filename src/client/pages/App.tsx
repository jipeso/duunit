import { ThemeProvider, CssBaseline } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'

import { createAppTheme } from '../theme'
import NavBar from '../components/NavBar'
import Router from './Router'
import { DRAWER_WIDTH } from '../util/config.ts'
import type { LanguageId } from '#common/types/common.ts'

const App = () => {
  const { i18n } = useTranslation()
  const theme = createAppTheme(i18n.language as LanguageId)

  return (
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline />
      <NavBar />
      <Box
        component='main'
        id='main-content'
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          ml: { sm: String(DRAWER_WIDTH) + 'px' },
        }}
      >
        <Toolbar />
        <Router />
      </Box>
    </ThemeProvider>
  )
}

export default App
