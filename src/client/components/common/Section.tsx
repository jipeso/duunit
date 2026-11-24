import type { ReactNode } from 'react'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface Props {
  title: string
  action?: ReactNode
  children: ReactNode
}

const Section = ({ title, action, children }: Props) => (
  <Paper variant='outlined' sx={{ p: 3 }}>
    <Stack
      direction='row'
      useFlexGap
      spacing={2}
      sx={{ mb: 1, alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}
    >
      <Typography variant='h6' component='h2'>
        {title}
      </Typography>
      {action}
    </Stack>
    <Stack spacing={2}>{children}</Stack>
  </Paper>
)

export default Section
