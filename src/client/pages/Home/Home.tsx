import { Link as RouterLink } from 'react-router'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import { useTranslation, Trans } from 'react-i18next'
import { Divider } from '@mui/material'

const Home = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Typography component='h1' variant='h4' gutterBottom>
        {t('home.title')}
      </Typography>
      <Typography variant='body1' color='text.secondary' gutterBottom>
        {t('home.description')}
      </Typography>

      <Typography variant='h5' component='h2' gutterBottom sx={{ mt: 4 }}>
        {t('home.gettingStarted')}
      </Typography>

      <Typography>{t('home.gettingStartedDesc')}</Typography>

      <Box component='ol' sx={{ mt: 1, pl: 2 }}>
        <li>
          <Trans
            i18nKey='home.gsStep1'
            components={{
              a: <Link component={RouterLink} to='/register' />,
            }}
          />
        </li>
        <li>
          <Trans
            i18nKey='home.gsStep2'
            components={{
              a: <Link component={RouterLink} to='/login' />,
            }}
          />
        </li>
        <li>
          <Trans
            i18nKey='home.gsStep3'
            components={{
              a: <Link component={RouterLink} to='/applications/new' />,
            }}
          />
        </li>
        <li>
          <Trans
            i18nKey='home.gsStep4'
            components={{
              a: <Link component={RouterLink} to='/applications' />,
            }}
          />
        </li>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography gutterBottom>{t('home.builtUsing')}</Typography>

      <Typography color='text.secondary' gutterBottom>
        <Trans
          i18nKey='home.sourceCode'
          components={{
            a: (
              <Link
                href='https://github.com/jipeso/duunit'
                target='_blank'
                rel='noopener'
              />
            ),
          }}
        />
      </Typography>
    </Container>
  )
}

export default Home
