import { Link as RouterLink } from 'react-router'
import Link from '@mui/material/Link'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { BarChart } from '@mui/x-charts/BarChart'
import { Trans, useTranslation } from 'react-i18next'

import type { ApplicationResponse } from '#common/types/applications.ts'
import useLocalStorage from '../../hooks/useLocalStorage'
import Section from '../../components/common/Section'
import {
  daysAgo,
  daysBetween,
  monthsAgo,
  monthsBetween,
  parseDate,
} from '../../util/date'

const UNITS = {
  day: {
    between: daysBetween,
    ago: daysAgo,
    labelFormat: { day: 'numeric', month: 'numeric' },
  },
  month: {
    between: monthsBetween,
    ago: monthsAgo,
    labelFormat: { month: 'short', year: '2-digit' },
  },
} satisfies Record<
  string,
  {
    between: (from: Date, to: Date) => number
    ago: (date: Date, amount: number) => Date
    labelFormat: Intl.DateTimeFormatOptions
  }
>

const RANGE_KEYS = ['week', 'month', 'year', 'all'] as const

type Range = (typeof RANGE_KEYS)[number]

const RANGES: Record<
  Range,
  { bucketCount: number | null; unit: keyof typeof UNITS }
> = {
  week: { bucketCount: 7, unit: 'day' },
  month: { bucketCount: 30, unit: 'day' },
  year: { bucketCount: 12, unit: 'month' },
  all: { bucketCount: null, unit: 'month' },
}

const DEFAULT_RANGE: Range = 'month'
const MIN_Y_AXIS_MAX = 5

const isRange = (value: unknown): value is Range =>
  RANGE_KEYS.some(key => key === value)

interface Props {
  applications: ApplicationResponse[]
  now: Date
}

const ApplicationsSentChart = ({ applications, now }: Props) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [storedRange, setRange] = useLocalStorage<Range>(
    'dashboardRange',
    DEFAULT_RANGE
  )
  const range = isRange(storedRange) ? storedRange : DEFAULT_RANGE
  const { unit, bucketCount: rangeBucketCount } = RANGES[range]
  const { between, ago, labelFormat } = UNITS[unit]

  const appliedUnitsAgo = applications.flatMap(({ appliedOn }) =>
    appliedOn ? [between(parseDate(appliedOn), now)] : []
  )

  const countsByUnitsAgo = new Map<number, number>()
  for (const unitsAgo of appliedUnitsAgo) {
    countsByUnitsAgo.set(unitsAgo, (countsByUnitsAgo.get(unitsAgo) ?? 0) + 1)
  }

  const bucketCount = rangeBucketCount ?? Math.max(0, ...appliedUnitsAgo) + 1

  const buckets = Array.from({ length: bucketCount }, (_, index) => {
    const unitsAgo = bucketCount - 1 - index
    return {
      label: ago(now, unitsAgo).toLocaleDateString(i18n.language, labelFormat),
      count: countsByUnitsAgo.get(unitsAgo) ?? 0,
    }
  })

  const bucketCounts = buckets.map(bucket => bucket.count)
  const totalInRange = bucketCounts.reduce((sum, count) => sum + count, 0)

  return (
    <Section title={t('home.applicationsSent')}>
      {appliedUnitsAgo.length === 0 ? (
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
            {t('home.total', { count: totalInRange })}
          </Typography>

          <BarChart
            height={260}
            hideLegend
            borderRadius={4}
            xAxis={[
              { scaleType: 'band', data: buckets.map(bucket => bucket.label) },
            ]}
            yAxis={[
              {
                tickMinStep: 1,
                max: Math.max(MIN_Y_AXIS_MAX, ...bucketCounts),
              },
            ]}
            series={[
              {
                data: bucketCounts,
                label: t('home.applicationsSent'),
                color: (theme.vars ?? theme).palette.primary.main,
              },
            ]}
          />

          <ToggleButtonGroup
            value={range}
            exclusive
            onChange={(_, value: Range | null) => {
              if (value) {
                setRange(value)
              }
            }}
            aria-label={t('home.range')}
          >
            {RANGE_KEYS.map(key => (
              <ToggleButton key={key} value={key}>
                {t(`home.ranges.${key}`)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </>
      )}
    </Section>
  )
}

export default ApplicationsSentChart
