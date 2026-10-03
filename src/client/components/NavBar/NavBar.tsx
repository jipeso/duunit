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
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import WorkIcon from '@mui/icons-material/Work'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

import Settings from '../Settings'
import useIsMobile from '../../hooks/useIsMobile'
import { authClient } from '../../util/authClient'
import { DRAWER_WIDTH } from '../../util/config'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { data: session } = authClient.useSession()

  const isLoggedIn = !!session
  const isAdmin = session?.user.role === 'admin'

  const links = [
    { label: t('navigation.home'), to: '/', icon: <HomeIcon />, show: true },
    {
      label: t('navigation.profile'),
      to: '/profile',
      icon: <PersonIcon />,
      show: isLoggedIn,
    },
    {
      label: t('navigation.applications'),
      to: '/applications',
      icon: <WorkIcon />,
      show: isLoggedIn,
    },
    {
      label: t('navigation.login'),
      to: '/login',
      icon: <LoginIcon />,
      show: !isLoggedIn,
    },
    {
      label: t('navigation.register'),
      to: '/register',
      icon: <PersonAddIcon />,
      show: !isLoggedIn,
    },
    {
      label: t('navigation.admin'),
      to: '/admin',
      icon: <AdminPanelSettingsIcon />,
      show: isAdmin,
    },
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
              <ListItemIcon sx={{ minWidth: 36 }}>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              setMenuOpen(false)
              setSettingsOpen(true)
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={t('navigation.settings')} />
          </ListItemButton>
        </ListItem>
      </List>
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
