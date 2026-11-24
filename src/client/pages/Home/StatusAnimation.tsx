import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { keyframes } from '@mui/material/styles'
import CheckIcon from '@mui/icons-material/Check'
import { useTranslation } from 'react-i18next'

import type { ApplicationStatus } from '#common/types/applications.ts'
import { statusColors } from '../../util/applications'

const STEPS = [
  'saved',
  'applied',
  'interviewing',
  'offer',
] as const satisfies readonly ApplicationStatus[]
const LAST_STEP = STEPS.length - 1
const STEP_MS = 1100

const pop = keyframes`
  0% { transform: scale(0.6); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
`

const CONFETTI_COLORS = [
  'primary.main',
  'success.main',
  'warning.main',
  'info.main',
]
const CONFETTI = Array.from({ length: 14 }, (_, index) => {
  const angle = (index / 14) * 2 * Math.PI
  const distance = 50 + (index % 3) * 15
  return {
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    burst: keyframes`
      from { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
      to {
        transform: translate(
          calc(-50% + ${Math.cos(angle) * distance}px),
          calc(-50% + ${Math.sin(angle) * distance}px)
        ) rotate(${index * 50}deg);
        opacity: 0;
      }
    `,
  }
})

const stepColor = (status: ApplicationStatus) => {
  const color = statusColors[status]
  return color === 'default' ? 'grey.500' : `${color}.main`
}

const StatusAnimation = () => {
  const { t } = useTranslation()
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)', {
    noSsr: true,
  })
  const [step, setStep] = useState(0)
  const current = reduceMotion ? LAST_STEP : step
  const status = STEPS[current] ?? 'offer'
  const done = current === LAST_STEP

  useEffect(() => {
    if (reduceMotion || step === LAST_STEP) {
      return
    }
    const timeout = setTimeout(() => {
      setStep(step + 1)
    }, STEP_MS)
    return () => {
      clearTimeout(timeout)
    }
  }, [step, reduceMotion])

  return (
    <Box
      aria-hidden
      sx={{ mt: 6, mx: 'auto', maxWidth: 360, textAlign: 'left' }}
    >
      <Paper variant='outlined' sx={{ p: 2, mb: 2 }}>
        <Stack
          direction='row'
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Box>
            <Typography variant='subtitle2'>
              {t('home.demoPosition')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {t('home.demoCompany')}
            </Typography>
          </Box>

          <Box sx={{ position: 'relative' }}>
            <Chip
              key={status}
              size='small'
              variant='outlined'
              color={statusColors[status]}
              icon={done ? <CheckIcon /> : undefined}
              label={t(`applications.statuses.${status}`)}
              sx={{
                animation: reduceMotion ? 'none' : `${pop} 400ms ease-out`,
              }}
            />
            {done &&
              !reduceMotion &&
              CONFETTI.map(({ color, burst }, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 6,
                    height: 6,
                    borderRadius: 0.5,
                    bgcolor: color,
                    opacity: 0,
                    animation: `${burst} 900ms ease-out`,
                  }}
                />
              ))}
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ position: 'relative', mx: 1 }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 2,
            transform: 'translateY(-50%)',
            bgcolor: 'divider',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            height: 2,
            width: `${(current / LAST_STEP) * 100}%`,
            transform: 'translateY(-50%)',
            bgcolor: stepColor(status),
            transition: 'width 600ms ease, background-color 600ms ease',
          }}
        />
        <Stack
          direction='row'
          sx={{ position: 'relative', justifyContent: 'space-between' }}
        >
          {STEPS.map((stepStatus, index) => (
            <Box
              key={stepStatus}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: 2,
                borderColor:
                  index <= current ? stepColor(stepStatus) : 'divider',
                bgcolor:
                  index <= current ? stepColor(stepStatus) : 'background.paper',
                transition: 'all 300ms ease 300ms',
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export default StatusAnimation
