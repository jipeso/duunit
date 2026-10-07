import { useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import MoreVertIcon from '@mui/icons-material/MoreVert'
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
import EditEventDateDialog from './EditEventDateDialog'
import { statusColors } from '../../util/applications'
import { parseDate } from '../../util/date'

const StatusTimeline = ({ applicationId }: { applicationId: string }) => {
  const { t, i18n } = useTranslation()
  const { data: events, isError } = useStatusEvents(applicationId)
  const { mutate, isPending, error, reset } = useDeleteStatusEvent()
  const [eventIdToDelete, setEventIdToDelete] = useState<string | null>(null)
  const [eventIdToEdit, setEventIdToEdit] = useState<string | null>(null)
  const [menu, setMenu] = useState<{
    anchorEl: HTMLElement
    eventId: string
  } | null>(null)

  const editIndex = events?.findIndex(event => event.id === eventIdToEdit) ?? -1
  const eventToEdit = events?.[editIndex]

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
                  <IconButton
                    size='small'
                    aria-label={t('applications.moreActions')}
                    onClick={e => {
                      setMenu({ anchorEl: e.currentTarget, eventId: event.id })
                    }}
                  >
                    <MoreVertIcon fontSize='small' />
                  </IconButton>
                </TimelineContent>
              </TimelineItem>
            )
          })}
        </Timeline>
      )}

      <Menu
        anchorEl={menu?.anchorEl}
        open={menu !== null}
        onClose={() => {
          setMenu(null)
        }}
      >
        <MenuItem
          onClick={() => {
            setEventIdToEdit(menu?.eventId ?? null)
            setMenu(null)
          }}
        >
          {t('applications.editEventDate')}
        </MenuItem>
        <MenuItem
          disabled={events?.length === 1}
          onClick={() => {
            setEventIdToDelete(menu?.eventId ?? null)
            setMenu(null)
          }}
        >
          {t('common.buttons.delete')}
        </MenuItem>
      </Menu>

      {events && eventToEdit && (
        <EditEventDateDialog
          applicationId={applicationId}
          event={eventToEdit}
          min={events[editIndex - 1]?.occurredOn}
          max={events[editIndex + 1]?.occurredOn}
          onClose={() => {
            setEventIdToEdit(null)
          }}
        />
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
