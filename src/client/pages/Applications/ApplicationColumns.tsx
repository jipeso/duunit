import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import EditIcon from '@mui/icons-material/Edit'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid'
import type { TFunction } from 'i18next'

import type {
  ApplicationResponse,
  ApplicationStatus,
} from '#common/types/applications.ts'

const EMPTY_VALUE = '—'

const statusColors: Record<
  ApplicationStatus,
  'default' | 'info' | 'warning' | 'success' | 'error'
> = {
  saved: 'default',
  applied: 'info',
  interviewing: 'warning',
  offer: 'success',
  accepted: 'success',
  rejected: 'error',
  withdrawn: 'default',
}

export const createApplicationColumns = (
  t: TFunction,
  language: string,
  onEdit: (id: string) => void
): GridColDef<ApplicationResponse>[] => {
  const dateFormatter = new Intl.DateTimeFormat(language)

  return [
    {
      field: 'company',
      headerName: t('fields.company'),
      flex: 1,
      rowHeader: true,
    },
    {
      field: 'position',
      headerName: t('fields.position'),
      flex: 1,
    },
    {
      field: 'location',
      headerName: t('fields.location'),
      flex: 1,
      renderCell: ({ row }) => row.location ?? EMPTY_VALUE,
    },
    {
      field: 'status',
      headerName: t('fields.status'),
      flex: 1,
      renderCell: ({ row }) => (
        <Chip
          size='small'
          variant='outlined'
          color={statusColors[row.status]}
          label={t(`applications.statuses.${row.status}`)}
        />
      ),
    },
    {
      field: 'appliedAt',
      headerName: t('fields.appliedAt'),
      flex: 1,
      type: 'date',
      valueGetter: (_, row) => new Date(row.appliedAt ?? row.createdAt),
      valueFormatter: value => dateFormatter.format(value),
    },
    {
      field: 'jobPostingUrl',
      headerName: t('fields.jobPostingUrl'),
      flex: 1,
      sortable: false,
      filterable: false,
      align: 'right',
      renderCell: ({ row, hasFocus }) =>
        row.jobPostingUrl ? (
          <Tooltip title={t('applications.openJobPosting')}>
            <IconButton
              size='small'
              href={row.jobPostingUrl}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={t('applications.openJobPosting')}
              tabIndex={hasFocus ? 0 : -1}
            >
              <OpenInNewIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        ) : null,
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: ({ row }) => [
        <GridActionsCellItem
          key='edit'
          icon={<EditIcon fontSize='small' />}
          label={t('applications.edit')}
          data-testid='application-edit'
          onClick={() => {
            onEdit(row.id)
          }}
        />,
      ],
    },
  ]
}
