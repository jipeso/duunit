import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { type SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router'

import type {
  ApplicationResponse,
  NewApplication,
} from '#common/types/applications.ts'
import useApplications from '../../hooks/useApplications'
import useUpdateApplication from '../../hooks/useUpdateApplication'
import { useNotification } from '../../components/Notification'
import ApplicationForm, { toFormValues } from '../../components/ApplicationForm'
import { isNotFoundError } from '../../util/apiClient'

interface EditApplicationFormProps {
  application: ApplicationResponse
}

const EditApplicationForm = ({ application }: EditApplicationFormProps) => {
  const { t } = useTranslation()
  const { mutate: updateApplication, isPending, error } = useUpdateApplication()
  const { showSuccess } = useNotification()
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo =
    (location.state as { returnTo?: string } | null)?.returnTo ??
    '/applications'

  const onSubmit: SubmitHandler<NewApplication> = data => {
    updateApplication(
      { id: application.id, values: data },
      {
        onSuccess: () => {
          showSuccess(t('notifications.applicationUpdatedSuccess'))
          void navigate(returnTo)
        },
      }
    )
  }

  return (
    <ApplicationForm
      defaultValues={toFormValues(application)}
      onSubmit={onSubmit}
      submitLabel={t('common.buttons.update')}
      isPending={isPending}
      error={
        error &&
        t(
          isNotFoundError(error)
            ? 'applications.notFound'
            : 'common.errors.unexpected'
        )
      }
      returnTo={returnTo}
      requireChanges
    />
  )
}

const EditApplication = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { data: applications, isPending, isError } = useApplications()

  if (isPending) {
    return <CircularProgress />
  }

  const application = applications?.find(app => app.id === id)

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
          {t('applications.edit')}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          {t('applications.editSubtitle')}
        </Typography>

        {application ? (
          <EditApplicationForm key={application.id} application={application} />
        ) : (
          <Alert
            severity={isError ? 'error' : 'warning'}
            sx={{ borderRadius: 1, width: '100%' }}
          >
            {t(isError ? 'common.errors.loadFailed' : 'applications.notFound')}
          </Alert>
        )}
      </Box>
    </Container>
  )
}

export default EditApplication
