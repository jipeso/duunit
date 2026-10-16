import type { ReactNode } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface Props {
  description: string
  children: ReactNode
}

const ProfileAction = ({ description, children }: Props) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={{ xs: 1, sm: 2 }}
    sx={{
      alignItems: { xs: 'flex-start', sm: 'center' },
      justifyContent: 'space-between',
    }}
  >
    <Typography variant='body2' color='text.secondary'>
      {description}
    </Typography>
    {children}
  </Stack>
)

export default ProfileAction
