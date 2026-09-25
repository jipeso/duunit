import { useState } from 'react'
import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'

import Settings from '../Settings'
import useIsMobile from '../../hooks/useIsMobile'
import useAuth from '../../hooks/useAuth'
import { DRAWER_WIDTH } from '../../util/config'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { state } = useAuth()
  const user = state.status === 'authenticated' ? state.user : null
  const isLoggedIn = state.status === 'authenticated'
  const isAdmin = user?.roles.includes('admin') ?? false

  const links = [
    { label: t('common.home'), to: '/', show: true },
    { label: t('common.profile'), to: '/profile', show: isLoggedIn },
    { label: t('common.login'), to: '/login', show: !isLoggedIn },
    { label: t('common.register'), to: '/register', show: !isLoggedIn },
    { label: t('common.admin'), to: '/admin', show: isAdmin },
  ].filter(link => link.show)

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton
            size='small'
            onClick={() => {
              setMenuOpen(false)
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <Toolbar />

      <List>
        {links.map(link => (
          <ListItem key={link.label} disablePadding>
            <ListItemButton
              component={NavLink}
              to={link.to}
              onClick={() => {
                setMenuOpen(false)
              }}
              sx={{
                '&.active': {
                  textDecoration: 'underline',
                  textUnderlineOffset: '5px',
                  textDecorationThickness: '2px',
                },
              }}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 1 }}>
        <IconButton
          onClick={() => {
            setSettingsOpen(true)
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Box>
    </Box>
  )

  return (
    <>
      {isMobile && !menuOpen && (
        <IconButton
          sx={{
            position: 'fixed',
            top: 8,
            left: 8,
            zIndex: 1400,
          }}
          onClick={() => {
            setMenuOpen(true)
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? menuOpen : true}
        onClose={
          isMobile
            ? () => {
                setMenuOpen(false)
              }
            : undefined
        }
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              borderRight: 1,
              borderColor: 'divider',
            },
          },
        }}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Settings
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false)
        }}
      />
    </>
  )
}

export default Navbar
