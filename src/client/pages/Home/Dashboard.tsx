import { useState } from 'react'
import { Link as RouterLink } from 'react-router'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { BarChart } from '@mui/x-charts/BarChart'
import { Trans, useTranslation } from 'react-i18next'

import useApplications from '../../hooks/useApplications'
import PageLoader from '../../components/common/PageLoader'
import Section from '../../components/common/Section'
import { DATE_TIME_FORMAT, parseDate } from '../../util/date'

const RANGES = {
  week: { count: 7, unit: 'day' },
  month: { count: 30, unit: 'day' },
  year: { count: 12, unit: 'month' },
  all: { count: null, unit: 'month' },
} as const

const DAY_MS = 24 * 60 * 60 * 1000
const UPCOMING_LIMIT = 5
const MIN_CHART_MAX = 5

type Range = keyof typeof RANGES

const Dashboard = () => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { data: applications = [], isPending, isError } = useApplications()
  const [range, setRange] = useState<Range>('month')
  const [now] = useState(() => new Date())

  if (isPending) {
    return <PageLoader />
  }

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )

  const upcoming = applications
    .flatMap(({ id, position, company, status, nextInterviewAt, deadline }) => {
      const title = `${position} · ${company}`
      const items = []
      if (nextInterviewAt && new Date(nextInterviewAt) > now) {
        const date = new Date(nextInterviewAt)
        items.push({
          id,
          title,
          date,
          detail: `${t('fields.nextInterviewAt')}: ${date.toLocaleString(i18n.language, DATE_TIME_FORMAT)}`,
        })
      }

      if (
        status === 'saved' &&
        deadline &&
        parseDate(deadline) >= startOfToday
      ) {
        const date = parseDate(deadline)
        items.push({
          id,
          title,
          date,
          detail: `${t('fields.deadline')}: ${date.toLocaleDateString(i18n.language)}`,
        })
      }

      return items
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, UPCOMING_LIMIT)

  const { unit } = RANGES[range]
  const ago = applications.flatMap(({ appliedOn }) => {
    if (!appliedOn) {
      return []
    }

    const date = parseDate(appliedOn)
    return unit === 'month'
      ? (now.getFullYear() - date.getFullYear()) * 12 +
          now.getMonth() -
          date.getMonth()
      : Math.round((startOfToday.getTime() - date.getTime()) / DAY_MS)
  })

  const count = RANGES[range].count ?? Math.max(0, ...ago) + 1

  const buckets = Array.from({ length: count }, (_, index) => {
    const offset = count - 1 - index
    const date =
      unit === 'month'
        ? new Date(now.getFullYear(), now.getMonth() - offset, 1)
        : new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset)

    return {
      label: date.toLocaleDateString(
        i18n.language,
        unit === 'month'
          ? { month: 'short', year: '2-digit' }
          : { day: 'numeric', month: 'numeric' }
      ),
      count: ago.filter(value => value === offset).length,
    }
  })

  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0)

  return (
    <Container maxWidth='sm'>
      <Typography component='h1' variant='h5' gutterBottom>
        {t('home.overview')}
      </Typography>

      <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
        {t('home.overviewSubtitle')}
      </Typography>

      {isError && (
        <Alert severity='error' sx={{ borderRadius: 1, mb: 3 }}>
          {t('common.errors.loadFailed')}
        </Alert>
      )}

      {applications.length === 0 ? (
        <Paper variant='outlined' sx={{ p: 4, textAlign: 'center' }}>
          <Typography color='text.secondary' gutterBottom>
            {t('applications.empty')}
          </Typography>
          <Button
            component={RouterLink}
            to='/applications/new'
            variant='contained'
            sx={{ mt: 1 }}
          >
            {t('applications.new')}
          </Button>
        </Paper>
      ) : (
        <Stack spacing={3}>
          <Section title={t('home.upcoming')}>
            {upcoming.length === 0 ? (
              <Typography variant='body2' color='text.secondary'>
                {t('home.noUpcoming')}
              </Typography>
            ) : (
              <List disablePadding>
                {upcoming.map(item => (
                  <ListItemButton
                    key={item.id + item.detail}
                    component={RouterLink}
                    to={`/applications/${item.id}`}
                    sx={{ px: 1, borderRadius: 1 }}
                  >
                    <ListItemText
                      primary={item.title}
                      secondary={item.detail}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Section>

          <Section title={t('home.applicationsSent')}>
            <ToggleButtonGroup
              value={range}
              exclusive
              color='primary'
              size='small'
              onChange={(_, value: Range | null) => {
                if (value) {
                  setRange(value)
                }
              }}
              aria-label={t('home.range')}
            >
              {Object.keys(RANGES).map(key => (
                <ToggleButton key={key} value={key}>
                  {t(`home.ranges.${key as Range}`)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            {total === 0 ? (
              <Typography variant='body2' color='text.secondary'>
                <Trans
                  i18nKey='home.noneSent'
                  components={{
                    a: <Link component={RouterLink} to='/applications/new' />,
                  }}
                />
              </Typography>
            ) : (
              <>
                <Typography variant='body2' color='text.secondary'>
                  {t('home.total', { count: total })}
                </Typography>
                <BarChart
                  height={260}
                  hideLegend
                  borderRadius={4}
                  xAxis={[
                    { scaleType: 'band', data: buckets.map(b => b.label) },
                  ]}
                  yAxis={[
                    {
                      tickMinStep: 1,
                      max: Math.max(
                        MIN_CHART_MAX,
                        ...buckets.map(b => b.count)
                      ),
                    },
                  ]}
                  series={[
                    {
                      data: buckets.map(b => b.count),
                      label: t('home.applicationsSent'),
                      color: (theme.vars ?? theme).palette.primary.main,
                    },
                  ]}
                />
              </>
            )}
          </Section>
        </Stack>
      )}
    </Container>
  )
}

export default Dashboard
