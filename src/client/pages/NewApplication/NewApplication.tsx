import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { type SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { type NewApplication as NewApplicationPayload } from '#common/types/applications.ts'
import useCreateApplication from '../../hooks/useCreateApplication'
import { useNotification } from '../../components/Notification'
import ApplicationForm from '../../components/ApplicationForm'

const NewApplication = () => {
  const { t } = useTranslation()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { mutateAsync: createApplication, isPending } = useCreateApplication()
  const { showSuccess } = useNotification()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<NewApplicationPayload> = async data => {
    setGlobalError(null)

    try {
      await createApplication(data)
      showSuccess(t('notifications.applicationCreatedSuccess'))
      void navigate('/applications')
    } catch {
      setGlobalError('common.errors.unexpected')
    }
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Typography
          component='h1'
          variant='h5'
          color='text.primary'
          gutterBottom
        >
          {t('applications.new')}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          {t('applications.newSubtitle')}
        </Typography>

        <ApplicationForm
          defaultValues={{ status: 'applied' }}
          onSubmit={onSubmit}
          submitLabel={t('common.buttons.create')}
          isPending={isPending}
          error={globalError}
        />
      </Box>
    </Container>
  )
}

export default NewApplication
