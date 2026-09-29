import { useEffect, useMemo } from 'react'
import {
  DataGrid,
  useGridApiRef,
  type GridAutosizeOptions,
} from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import Paper from '@mui/material/Paper'

import type { ApplicationResponse } from '#common/types/applications.ts'
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

  const columns = useMemo(
    () => createApplicationColumns(t, i18n.language),
    [t, i18n.language]
  )

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
    </Paper>
  )
}

export default ApplicationGrid
