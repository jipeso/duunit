import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'

import {
  type NewApplication as NewApplicationPayload,
  type NewApplicationInput,
} from '#common/types/applications.ts'
import useCreateApplication from '../../hooks/useCreateApplication'
import { useNotification } from '../../components/Notification'
import ApplicationForm from '../../components/ApplicationForm'

const NewApplication = () => {
  const { t } = useTranslation()
  const { mutate: createApplication, isPending, error } = useCreateApplication()
  const { showSuccess } = useNotification()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as {
    defaultValues?: Partial<NewApplicationInput>
    returnTo?: string
  } | null
  const returnTo = state?.returnTo ?? '/applications'

  const onSubmit = (data: NewApplicationPayload) => {
    createApplication(data, {
      onSuccess: () => {
        showSuccess(t('notifications.applicationCreatedSuccess'))
        void navigate('/applications')
      },
    })
  }

  return (
    <Container maxWidth='sm'>
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
          defaultValues={{ status: 'applied', ...state?.defaultValues }}
          onSubmit={onSubmit}
          submitLabel={t('common.buttons.create')}
          isPending={isPending}
          error={error && t('common.errors.unexpected')}
          returnTo={returnTo}
          showAppliedOn
        />
      </Box>
    </Container>
  )
}

export default NewApplication
