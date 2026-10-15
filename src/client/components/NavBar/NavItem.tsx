import type { ReactNode } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import { Link } from 'react-router'

interface NavItemProps {
  icon: ReactNode
  label: string
  collapsed: boolean
  to?: string
  selected?: boolean
  onClick: () => void
}

const TOOLTIP_ENTER_DELAY = 1000

const NavItem = ({
  icon,
  label,
  collapsed,
  to,
  selected,
  onClick,
}: NavItemProps) => (
  <ListItem disablePadding>
    <Tooltip
      title={collapsed ? label : ''}
      placement='right'
      enterDelay={TOOLTIP_ENTER_DELAY}
    >
      <ListItemButton
        {...(to && { component: Link, to })}
        selected={selected}
        onClick={onClick}
        sx={{
          mx: 0.5,
          px: 1.5,
          minHeight: 48,
          borderRadius: 1,
          '&.Mui-selected': {
            color: 'primary.main',
            '& .MuiListItemIcon-root': { color: 'inherit' },
          },
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        {!collapsed && <ListItemText primary={label} />}
      </ListItemButton>
    </Tooltip>
  </ListItem>
)

export default NavItem
