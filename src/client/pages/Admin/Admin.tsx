import Alert from '@mui/material/Alert'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import {
  DataGrid,
  GridFooterContainer,
  GridPagination,
  gridFilteredSortedRowEntriesSelector,
  useGridApiContext,
  useGridSelector,
  type GridColDef,
} from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'

import type { AdminUser } from '#common/types/admin.ts'
import useAdminUsers from '../../hooks/useAdminUsers'
import PageLoader from '../../components/common/PageLoader'

const GRID_HEIGHT = '60dvh'
const GRID_MIN_HEIGHT = 300
const GRID_MAX_HEIGHT = 600

const Footer = () => {
  const { t } = useTranslation()
  const apiRef = useGridApiContext()
  const users = useGridSelector(
    apiRef,
    gridFilteredSortedRowEntriesSelector
  ).map(row => row.model as AdminUser)

  const sum = (key: 'applications' | 'analyses') =>
    users.reduce((total, user) => total + user[key], 0)

  return (
    <GridFooterContainer>
      <Stack sx={{ px: 2, py: 1 }}>
        <Typography variant='body2' color='text.secondary'>
          {t('admin.totalApplications')}: {sum('applications')}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('admin.totalAnalyses')}: {sum('analyses')}
        </Typography>
      </Stack>
      <GridPagination />
    </GridFooterContainer>
  )
}

const Admin = () => {
  const { t, i18n } = useTranslation()
  const { data: users = [], isPending, isError } = useAdminUsers()

  if (isPending) {
    return <PageLoader />
  }

  const columns: GridColDef<AdminUser>[] = [
    { field: 'name', headerName: t('admin.name') },
    { field: 'email', headerName: t('admin.email') },
    { field: 'role', headerName: t('admin.role') },
    {
      field: 'createdAt',
      headerName: t('admin.joined'),
      valueFormatter: (value: string) =>
        new Date(value).toLocaleDateString(i18n.language),
    },
    {
      field: 'applications',
      headerName: t('admin.applications'),
      type: 'number',
    },
    { field: 'resumes', headerName: t('admin.resumes'), type: 'number' },
    { field: 'analyses', headerName: t('admin.analyses'), type: 'number' },
  ]

  return (
    <Container maxWidth='md'>
      <Typography
        component='h1'
        variant='h5'
        color='text.primary'
        gutterBottom
        sx={{ mb: 4 }}
      >
        {t('admin.title')}
      </Typography>

      {isError && (
        <Alert severity='error' sx={{ borderRadius: 1, mb: 3 }}>
          {t('common.errors.loadFailed')}
        </Alert>
      )}

      <Paper
        sx={{
          height: GRID_HEIGHT,
          minHeight: GRID_MIN_HEIGHT,
          maxHeight: GRID_MAX_HEIGHT,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          aria-label={t('admin.users')}
          disableRowSelectionOnClick
          pageSizeOptions={[50]}
          initialState={{ pagination: { paginationModel: { pageSize: 50 } } }}
          autosizeOnMount
          autosizeOptions={{ includeHeaders: true, includeOutliers: true }}
          slots={{ footer: Footer }}
          sx={{ height: '100%', width: '100%', border: 0 }}
        />
      </Paper>
    </Container>
  )
}

export default Admin
