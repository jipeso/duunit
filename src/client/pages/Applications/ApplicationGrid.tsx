import { useEffect, useMemo, useState } from 'react'
import {
  DataGrid,
  useGridApiRef,
  type GridAutosizeOptions,
} from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import Paper from '@mui/material/Paper'

import type { ApplicationResponse } from '#common/types/applications.ts'
import useDeleteApplication from '../../hooks/useDeleteApplication'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useNotification } from '../../components/Notification'
import { createApplicationColumns } from './ApplicationColumns'

interface ApplicationGridProps {
  applications: ApplicationResponse[]
}

const GRID_HEIGHT = '70dvh'
const GRID_MIN_HEIGHT = 300
const GRID_MAX_HEIGHT = 600

const AUTOSIZE_OPTIONS: GridAutosizeOptions = {
  includeHeaders: true,
  includeOutliers: true,
}

const INITIAL_SORT_MODEL = [{ field: 'appliedAt', sort: 'desc' as const }]

const ApplicationGrid = ({ applications }: ApplicationGridProps) => {
  const { t, i18n } = useTranslation()
  const apiRef = useGridApiRef()
  const navigate = useNavigate()
  const { showSuccess } = useNotification()
  const {
    mutate: deleteApplication,
    isPending: isDeleting,
    isError: isDeleteError,
    reset: resetDelete,
  } = useDeleteApplication()

  const [applicationToDelete, setApplicationToDelete] =
    useState<ApplicationResponse | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const columns = useMemo(
    () =>
      createApplicationColumns(t, i18n.language, {
        onEdit: application => {
          void navigate(`/applications/${application.id}/edit`)
        },
        onDelete: application => {
          resetDelete()
          setApplicationToDelete(application)
          setIsDeleteDialogOpen(true)
        },
      }),
    [t, i18n.language, navigate, resetDelete]
  )

  const confirmDelete = () => {
    if (!applicationToDelete) {
      return
    }

    deleteApplication(applicationToDelete.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        showSuccess(t('notifications.applicationDeletedSuccess'))
      },
    })
  }

  useEffect(() => {
    if (applications.length === 0) {
      return
    }

    const frame = requestAnimationFrame(() => {
      const api = apiRef.current

      if (!api) {
        return
      }

      void api.autosizeColumns(AUTOSIZE_OPTIONS)
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [applications.length, columns, apiRef])

  return (
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
        apiRef={apiRef}
        rows={applications}
        columns={columns}
        aria-label={t('applications.title')}
        disableRowSelectionOnClick
        sx={{
          height: '100%',
          width: '100%',
          border: 0,
        }}
        initialState={{
          sorting: {
            sortModel: INITIAL_SORT_MODEL,
          },
        }}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title={t('applications.delete')}
        message={t('applications.deleteConfirm', {
          company: applicationToDelete?.company,
          position: applicationToDelete?.position,
        })}
        confirmLabel={t('common.buttons.delete')}
        onConfirm={confirmDelete}
        onClose={() => {
          setIsDeleteDialogOpen(false)
        }}
        isPending={isDeleting}
        error={isDeleteError ? t('common.errors.unexpected') : null}
      />
    </Paper>
  )
}

export default ApplicationGrid
