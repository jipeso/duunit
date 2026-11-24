import { Link as RouterLink } from 'react-router'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import type { ApplicationResponse } from '#common/types/applications.ts'
import Section from '../../components/common/Section'
import { daysBetween, parseDate } from '../../util/date'

const FOLLOW_UP_DAYS = 14
const FOLLOW_UP_LIMIT = 5

interface Props {
  applications: ApplicationResponse[]
  now: Date
}

const FollowUps = ({ applications, now }: Props) => {
  const { t } = useTranslation()

  const followUps = applications
    .flatMap(({ id, position, company, status, appliedOn }) => {
      if (status !== 'applied' || !appliedOn) {
        return []
      }
      const days = daysBetween(parseDate(appliedOn), now)
      return days >= FOLLOW_UP_DAYS
        ? [{ id, title: `${position} - ${company}`, days }]
        : []
    })
    .sort((a, b) => b.days - a.days)
    .slice(0, FOLLOW_UP_LIMIT)

  return (
    <Section title={t('home.followUp')}>
      {followUps.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          {t('home.noFollowUp')}
        </Typography>
      ) : (
        <List disablePadding>
          {followUps.map(({ id, title, days }) => (
            <ListItemButton
              key={id}
              component={RouterLink}
              to={`/applications/${id}`}
              sx={{ mx: -1, px: 1, py: 0.5, borderRadius: 1 }}
            >
              <ListItemText
                primary={title}
                secondary={t('home.followUpDays', { count: days })}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Section>
  )
}

export default FollowUps
