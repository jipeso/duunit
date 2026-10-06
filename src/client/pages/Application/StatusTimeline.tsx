import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import { useTranslation } from 'react-i18next'

import useStatusEvents from '../../hooks/useStatusEvents'
import { statusColors } from '../../util/applications'

const StatusTimeline = ({ applicationId }: { applicationId: string }) => {
  const { t, i18n } = useTranslation()
  const { data: events, isError } = useStatusEvents(applicationId)

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
            [`& .${timelineItemClasses.root}:before`]: { flex: 0, p: 0 },
          }}
        >
          {events.map((event, index) => {
            const color = statusColors[event.status]

            return (
              <TimelineItem key={event.id}>
                <TimelineSeparator>
                  <TimelineDot
                    variant='outlined'
                    color={color === 'default' ? 'grey' : color}
                  />
                  {index < events.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography>
                    {t(`applications.statuses.${event.status}`)}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {new Date(event.changedAt).toLocaleDateString(
                      i18n.language
                    )}
                  </Typography>
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
