import { ThemeProvider, CssBaseline } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import { Routes, Route } from 'react-router'

import { createAppTheme } from '../theme'
import NavBar from '../components/NavBar'
import Router from './Router'
import LoggingOut from './LoggingOut'
import { DRAWER_WIDTH } from '../util/config.ts'
import type { LanguageId } from '#common/types/common.ts'

const App = () => {
  const { i18n } = useTranslation()
  const theme = createAppTheme(i18n.language as LanguageId)

  return (
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline />
      <Routes>
        <Route path='/logging-out' element={<LoggingOut />} />
        <Route
          path='/*'
          element={
            <>
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
            </>
          }
        />
      </Routes>
    </ThemeProvider>
  )
}

export default App
