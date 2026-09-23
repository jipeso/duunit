import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

const LoggingOut = () => {
  const { t } = useTranslation()

  return (
    <Stack
      spacing={1}
      sx={{
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant='h6'>{t('loggingOut.title')}</Typography>
      <Typography variant='body2' color='text.secondary'>
        {t('loggingOut.subtitle')}
      </Typography>
    </Stack>
  )
}

export default LoggingOut
