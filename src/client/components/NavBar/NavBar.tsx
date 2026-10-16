import { useState } from 'react'
import { matchPath, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Slide from '@mui/material/Slide'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import WorkIcon from '@mui/icons-material/Work'
import DescriptionIcon from '@mui/icons-material/Description'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

import NavItem from './NavItem'
import Settings from '../Settings'
import useIsMobile from '../../hooks/useIsMobile'
import { authClient } from '../../util/authClient'
import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from '../../util/config'

interface NavbarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

const Navbar = ({ collapsed, onToggleCollapse }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const isMobile = useIsMobile()
  const { data: session } = authClient.useSession()
  const trigger = useScrollTrigger()

  const isCollapsed = collapsed && !isMobile
  const width = isCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH
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
      label: t('navigation.resumes'),
      to: '/resumes',
      icon: <DescriptionIcon />,
      show: isLoggedIn,
    },
    {
      label: t('navigation.jobAnalysis'),
      to: '/job-analysis',
      icon: <ManageSearchIcon />,
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
      <Toolbar disableGutters sx={{ px: 1 }}>
        {isMobile ? (
          <IconButton
            aria-label={t('navigation.closeMenu')}
            onClick={() => {
              setMenuOpen(false)
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : (
          <IconButton
            aria-label={t(
              isCollapsed ? 'navigation.expandMenu' : 'navigation.collapseMenu'
            )}
            onClick={onToggleCollapse}
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </Toolbar>

      <List sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {links.map(link => (
          <NavItem
            key={link.to}
            icon={link.icon}
            label={link.label}
            collapsed={isCollapsed}
            to={link.to}
            selected={
              !!matchPath({ path: link.to, end: link.to === '/' }, pathname)
            }
            onClick={() => {
              setMenuOpen(false)
            }}
          />
        ))}
      </List>
      <Divider />
      <List>
        <NavItem
          icon={<SettingsIcon />}
          label={t('navigation.settings')}
          collapsed={isCollapsed}
          onClick={() => {
            setMenuOpen(false)
            setSettingsOpen(true)
          }}
        />
      </List>
    </Box>
  )

  return (
    <>
      {isMobile && !menuOpen && (
        <Slide appear={false} direction='down' in={!trigger}>
          <IconButton
            sx={{
              position: 'fixed',
              top: 8,
              left: 8,
              zIndex: 1400,
            }}
            aria-label={t('navigation.openMenu')}
            onClick={() => {
              setMenuOpen(true)
            }}
          >
            <MenuIcon />
          </IconButton>
        </Slide>
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
          width,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width,
            boxSizing: 'border-box',
            overflowX: 'hidden',
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
