import { useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import { useTranslation } from 'react-i18next'

import useStatusEvents from '../../hooks/useStatusEvents'
import useDeleteStatusEvent from '../../hooks/useDeleteStatusEvent'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { statusColors } from '../../util/applications'
import { parseDate } from '../../util/date'

const StatusTimeline = ({ applicationId }: { applicationId: string }) => {
  const { t, i18n } = useTranslation()
  const { data: events, isError } = useStatusEvents(applicationId)
  const { mutate, isPending, error, reset } = useDeleteStatusEvent()
  const [eventIdToDelete, setEventIdToDelete] = useState<string | null>(null)

  const closeDialog = () => {
    reset()
    setEventIdToDelete(null)
  }

  const confirmDelete = () => {
    if (eventIdToDelete) {
      mutate(
        { applicationId, eventId: eventIdToDelete },
        { onSuccess: closeDialog }
      )
    }
  }

  return (
    <Box>
      <Typography component='h2' variant='h6' sx={{ mb: 1 }}>
        {t('applications.timeline')}
      </Typography>
      {isError && (
        <Typography variant='body2' color='text.secondary'>
          {t('common.errors.loadFailed')}
        </Typography>
      )}
      {events && (
        <Timeline
          data-testid='application-timeline'
          sx={{
            m: 0,
            p: 0,
            [`& .${timelineItemClasses.root}::before`]: { display: 'none' },
          }}
        >
          {events.map((event, index) => {
            const color = statusColors[event.status]

            return (
              <TimelineItem key={event.id}>
                <TimelineSeparator>
                  <TimelineDot color={color === 'default' ? 'grey' : color} />
                  {index < events.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>
                      {t(`applications.statuses.${event.status}`)}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {parseDate(event.occurredOn).toLocaleDateString(
                        i18n.language
                      )}
                    </Typography>
                  </Box>
                  {events.length > 1 && (
                    <Tooltip title={t('common.buttons.delete')}>
                      <IconButton
                        size='small'
                        aria-label={t('common.buttons.delete')}
                        onClick={() => {
                          setEventIdToDelete(event.id)
                        }}
                      >
                        <DeleteOutlinedIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  )}
                </TimelineContent>
              </TimelineItem>
            )
          })}
        </Timeline>
      )}

      <ConfirmDialog
        open={eventIdToDelete !== null}
        title={t('applications.deleteEvent')}
        message={t('applications.deleteEventConfirm')}
        confirmLabel={t('common.buttons.delete')}
        onConfirm={confirmDelete}
        onClose={closeDialog}
        isPending={isPending}
        error={error && t('common.errors.unexpected')}
      />
    </Box>
  )
}

export default StatusTimeline
