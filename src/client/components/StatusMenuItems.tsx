import ListSubheader from '@mui/material/ListSubheader'
import MenuItem, { type MenuItemProps } from '@mui/material/MenuItem'
import type { TFunction } from 'i18next'

import {
  APPLICATION_STATUSES,
  STATUS_DATE_FIELD,
  type ApplicationStatus,
} from '#common/types/applications.ts'

const groupOf = (status: ApplicationStatus) => {
  const field = STATUS_DATE_FIELD[status]
  if (!field) return 'notSent'
  return field === 'closedOn' ? 'closed' : 'inProgress'
}

const StatusMenuItems = (
  t: TFunction,
  itemProps?: (status: ApplicationStatus) => MenuItemProps
) =>
  APPLICATION_STATUSES.flatMap((status, index) => {
    const group = groupOf(status)
    const previous = APPLICATION_STATUSES[index - 1]
    const item = (
      <MenuItem key={status} value={status} {...itemProps?.(status)}>
        {t(`applications.statuses.${status}`)}
      </MenuItem>
    )

    if (previous && groupOf(previous) === group) return [item]

    return [
      <ListSubheader
        key={group}
        color='primary'
        sx={theme => ({
          ...theme.typography.overline,
          lineHeight: '32px',
          ...(previous && { borderTop: 1, borderColor: 'divider', mt: 0.5 }),
        })}
      >
        {t(`applications.statusGroups.${group}`)}
      </ListSubheader>,
      item,
    ]
  })

export default StatusMenuItems
