import { Link as RouterLink } from 'react-router'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import type { ApplicationResponse } from '#common/types/applications.ts'
import useLocalStorage from '../../hooks/useLocalStorage'
import Section from '../../components/common/Section'
import { DATE_TIME_FORMAT, parseDate, startOfDay } from '../../util/date'

const UPCOMING_TYPES = ['deadlines', 'interviews'] as const
const UPCOMING_LIMIT = 5

type UpcomingType = (typeof UPCOMING_TYPES)[number]

interface UpcomingEvent {
  id: string
  type: UpcomingType
  title: string
  date: Date
  detail: string
}

const isUpcomingType = (value: unknown): value is UpcomingType =>
  UPCOMING_TYPES.some(type => type === value)

interface Props {
  applications: ApplicationResponse[]
  now: Date
}

const UpcomingEvents = ({ applications, now }: Props) => {
  const { t, i18n } = useTranslation()
  const [storedTypes, setTypes] = useLocalStorage<UpcomingType[]>(
    'dashboardUpcomingTypes',
    [...UPCOMING_TYPES]
  )
  const types = Array.isArray(storedTypes)
    ? storedTypes.filter(isUpcomingType)
    : [...UPCOMING_TYPES]
  const startOfToday = startOfDay(now)

  const events = applications
    .flatMap(({ id, position, company, status, nextInterviewAt, deadline }) => {
      const title = `${position} - ${company}`
      const items: UpcomingEvent[] = []

      const interviewDate = nextInterviewAt ? new Date(nextInterviewAt) : null
      if (
        types.includes('interviews') &&
        interviewDate &&
        interviewDate > now
      ) {
        items.push({
          id,
          type: 'interviews',
          title,
          date: interviewDate,
          detail: `${t('fields.nextInterviewAt')}: ${interviewDate.toLocaleString(i18n.language, DATE_TIME_FORMAT)}`,
        })
      }

      const deadlineDate = deadline ? parseDate(deadline) : null
      if (
        types.includes('deadlines') &&
        status === 'saved' &&
        deadlineDate &&
        deadlineDate >= startOfToday
      ) {
        items.push({
          id,
          type: 'deadlines',
          title,
          date: deadlineDate,
          detail: `${t('fields.deadline')}: ${deadlineDate.toLocaleDateString(i18n.language)}`,
        })
      }

      return items
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, UPCOMING_LIMIT)

  return (
    <Section
      title={t('home.upcoming')}
      action={
        <ToggleButtonGroup
          value={types}
          onChange={(_, value: UpcomingType[]) => {
            setTypes(value)
          }}
          aria-label={t('home.upcomingFilter')}
        >
          {UPCOMING_TYPES.map(type => (
            <ToggleButton key={type} value={type}>
              {t(`home.upcomingTypes.${type}`)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      }
    >
      {events.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          {types.length === 0
            ? t('home.noUpcomingTypes')
            : t('home.noUpcoming')}
        </Typography>
      ) : (
        <List disablePadding>
          {events.map(event => (
            <ListItemButton
              key={`${event.id}-${event.type}`}
              component={RouterLink}
              to={`/applications/${event.id}`}
              sx={{ mx: -1, px: 1, py: 0.5, borderRadius: 1 }}
            >
              <ListItemText primary={event.title} secondary={event.detail} />
            </ListItemButton>
          ))}
        </List>
      )}
    </Section>
  )
}

export default UpcomingEvents
