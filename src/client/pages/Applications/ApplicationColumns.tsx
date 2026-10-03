import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  GridActionsCellItem,
  GridEditSingleSelectCell,
  useGridApiContext,
  type GridColDef,
  type GridEditSingleSelectCellProps,
} from '@mui/x-data-grid'
import type { TFunction } from 'i18next'
import { Link as RouterLink } from 'react-router'

import {
  APPLICATION_STATUSES,
  type ApplicationResponse,
} from '#common/types/applications.ts'
import { EMPTY_VALUE, statusColors } from '../../util/applications'
import { parseDate } from '../../util/date'

interface ApplicationActions {
  onEdit: (application: ApplicationResponse) => void
  onDelete: (application: ApplicationResponse) => void
}

const StatusEditCell = (props: GridEditSingleSelectCellProps) => {
  const apiRef = useGridApiContext()

  return (
    <GridEditSingleSelectCell
      {...props}
      onValueChange={() => {
        apiRef.current.stopCellEditMode({ id: props.id, field: props.field })
      }}
    />
  )
}

export const createApplicationColumns = (
  t: TFunction,
  language: string,
  { onEdit, onDelete }: ApplicationActions
): GridColDef<ApplicationResponse>[] => {
  return [
    {
      field: 'position',
      headerName: t('fields.position'),
      flex: 1,
      rowHeader: true,
      renderCell: ({ row, hasFocus }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Link
            component={RouterLink}
            to={`/applications/${row.id}`}
            data-testid='application-details-link'
            tabIndex={hasFocus ? 0 : -1}
          >
            {row.position}
          </Link>
        </Box>
      ),
    },
    {
      field: 'company',
      headerName: t('fields.company'),
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
      editable: true,
      type: 'singleSelect',
      valueOptions: APPLICATION_STATUSES.map(status => ({
        value: status,
        label: t(`applications.statuses.${status}`),
      })),
      renderEditCell: props => <StatusEditCell {...props} />,
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
      valueGetter: (_, row) =>
        row.appliedAt ? parseDate(row.appliedAt) : new Date(row.createdAt),
      valueFormatter: (value: Date) => value.toLocaleDateString(language),
    },
    {
      field: 'jobPostingUrl',
      headerName: t('fields.jobPostingUrl'),
      flex: 1,
      sortable: false,
      filterable: false,
      align: 'center',
      renderCell: ({ row, hasFocus }) =>
        row.jobPostingUrl ? (
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
            onEdit(row)
          }}
        />,
        <GridActionsCellItem
          key='delete'
          icon={<DeleteIcon fontSize='small' />}
          label={t('applications.delete')}
          data-testid='application-delete'
          onClick={() => {
            onDelete(row)
          }}
        />,
      ],
    },
  ]
}
