import { useEffect } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'

import { createAppTheme } from '../theme'
import NavBar from '../components/NavBar'
import Router from './Router'
import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from '../util/config.ts'
import type { LanguageId } from '#common/types/common.ts'
import { NotificationProvider } from '../components/Notification/index.ts'
import { authClient } from '../util/authClient'
import useLocalStorage from '../hooks/useLocalStorage'

const App = () => {
  const [navCollapsed, setNavCollapsed] = useLocalStorage('navCollapsed', false)
  const { i18n } = useTranslation()
  const theme = createAppTheme(i18n.language as LanguageId)
  const queryClient = useQueryClient()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && !session) {
      queryClient.clear()
    }
  }, [queryClient, session, isPending])

  const drawerWidth = navCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH

  return (
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline />
      <NotificationProvider>
        <NavBar
          collapsed={navCollapsed}
          onToggleCollapse={() => {
            setNavCollapsed(prev => !prev)
          }}
        />
        <Box
          component='main'
          id='main-content'
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            pt: 4,
            pb: 8,
            ml: { sm: String(drawerWidth) + 'px' },
          }}
        >
          <Toolbar />
          <Router />
        </Box>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App
