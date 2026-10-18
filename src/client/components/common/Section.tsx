import type { ReactNode } from 'react'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface Props {
  title: string
  children: ReactNode
}

const Section = ({ title, children }: Props) => (
  <Paper variant='outlined' sx={{ p: 3 }}>
    <Typography variant='h6' component='h2' gutterBottom>
      {title}
    </Typography>
    <Stack spacing={2}>{children}</Stack>
  </Paper>
)

export default Section
