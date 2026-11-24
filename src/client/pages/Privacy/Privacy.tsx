import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import { useTranslation, Trans } from 'react-i18next'
import PageHeading from '../../components/common/PageHeading'

const SECTIONS = [
  'controller',
  'data',
  'purpose',
  'recipients',
  'cookies',
  'retention',
  'rights',
] as const

const Privacy = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth='sm'>
      <PageHeading title={t('privacy.title')} subtitle={t('privacy.updated')} />

      {SECTIONS.map(section => (
        <section key={section}>
          <Typography variant='h6' component='h2' gutterBottom sx={{ mt: 4 }}>
            {t(`privacy.sections.${section}.title`)}
          </Typography>
          <Typography sx={{ whiteSpace: 'pre-line' }}>
            <Trans
              i18nKey={`privacy.sections.${section}.body`}
              components={{
                email: <Link href='mailto:jipesonen@gmail.com' />,
                ombudsman: (
                  <Link
                    href='https://tietosuoja.fi'
                    target='_blank'
                    rel='noopener'
                  />
                ),
              }}
            />
          </Typography>
        </section>
      ))}
    </Container>
  )
}

export default Privacy
