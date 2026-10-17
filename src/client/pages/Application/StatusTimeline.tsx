import { useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import { useTranslation } from 'react-i18next'

import {
  APPLICATION_STATUSES,
  STATUS_DATE_FIELD,
  type ApplicationResponse,
} from '#common/types/applications.ts'
import useUpdateApplication from '../../hooks/useUpdateApplication'
import { useNotification } from '../../components/Notification'
import { statusColors } from '../../util/applications'
import { parseDate, today } from '../../util/date'

const StatusTimeline = ({
  application,
}: {
  application: ApplicationResponse
}) => {
  const { t, i18n } = useTranslation()
  const { showError } = useNotification()
  const { mutate, isPending } = useUpdateApplication()
  const [editing, setEditing] = useState<string | null>(null)
  const [date, setDate] = useState('')

  const entries = APPLICATION_STATUSES.flatMap(status => {
    const field = STATUS_DATE_FIELD[status]
    const entryDate = field && application[field]
    return entryDate && (field !== 'closedOn' || status === application.status)
      ? [{ field, status, date: entryDate }]
      : []
  })

  const save = (field: string) => {
    mutate(
      { id: application.id, values: { [field]: date } },
      {
        onSuccess: () => {
          setEditing(null)
        },
        onError: () => {
          showError(t('common.errors.unexpected'))
        },
      }
    )
  }

  return (
    <Box>
      <Typography component='h2' variant='h6' sx={{ mb: 1 }}>
        {t('applications.timeline')}
      </Typography>
      {entries.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          {t('applications.notSent')}
        </Typography>
      ) : (
        <Timeline
          data-testid='application-timeline'
          sx={{
            m: 0,
            p: 0,
            [`& .${timelineItemClasses.root}::before`]: { display: 'none' },
          }}
        >
          {entries.map((entry, index) => {
            const color = statusColors[entry.status]

            return (
              <TimelineItem key={entry.field}>
                <TimelineSeparator>
                  <TimelineDot color={color === 'default' ? 'grey' : color} />
                  {index < entries.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography>
                    {t(`applications.statuses.${entry.status}`)}
                  </Typography>
                  {editing === entry.field ? (
                    <Box
                      component='form'
                      onSubmit={event => {
                        event.preventDefault()
                        save(entry.field)
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <TextField
                        type='date'
                        size='small'
                        required
                        autoFocus
                        value={date}
                        onChange={event => {
                          setDate(event.target.value)
                        }}
                        disabled={isPending}
                        slotProps={{
                          htmlInput: {
                            min: entries[index - 1]?.date,
                            max: entries[index + 1]?.date ?? today(),
                            'aria-label': t('fields.date'),
                            'data-testid': 'timeline-date-input',
                          },
                        }}
                      />
                      <IconButton
                        type='submit'
                        size='small'
                        aria-label={t('common.buttons.save')}
                        disabled={isPending}
                        data-testid='timeline-date-save'
                      >
                        <CheckIcon fontSize='small' />
                      </IconButton>
                      <IconButton
                        size='small'
                        aria-label={t('common.buttons.cancel')}
                        onClick={() => {
                          setEditing(null)
                        }}
                        disabled={isPending}
                      >
                        <CloseIcon fontSize='small' />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='body2' color='text.secondary'>
                        {parseDate(entry.date).toLocaleDateString(
                          i18n.language
                        )}
                      </Typography>
                      <IconButton
                        size='small'
                        aria-label={t('applications.editDate')}
                        onClick={() => {
                          setEditing(entry.field)
                          setDate(entry.date)
                        }}
                        data-testid={`timeline-edit-${entry.status}`}
                        sx={{ ml: 0.5 }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  )}
                </TimelineContent>
              </TimelineItem>
            )
          })}
        </Timeline>
      )}
    </Box>
  )
}

export default StatusTimeline
