import type { ChangeEvent } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import UploadIcon from '@mui/icons-material/Upload'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'

import { MAX_RESUME_BYTES, MAX_RESUMES } from '#common/types/resumes.ts'
import useResumes from '../../hooks/useResumes'
import useUploadResume from '../../hooks/useUploadResume'
import { useNotification } from '../../components/Notification'

const LIST_MAX_HEIGHT = 600

const Resumes = () => {
  const { t, i18n } = useTranslation()
  const { showSuccess, showError } = useNotification()
  const { data: resumes = [], isPending, isError } = useResumes()
  const { mutate: upload, isPending: isUploading } = useUploadResume()

  if (isPending) {
    return <CircularProgress />
  }

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (file.type !== 'application/pdf') {
      showError(t('resumes.notPdf'))
      return
    }

    if (file.size > MAX_RESUME_BYTES) {
      showError(t('resumes.tooLarge'))
      return
    }

    upload(file, {
      onSuccess: () => {
        showSuccess(t('notifications.resumeUploadedSuccess'))
      },
      onError: () => {
        showError(t('common.errors.unexpected'))
      },
    })
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 4, mb: 8 }}>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Typography
          component='h1'
          variant='h5'
          color='text.primary'
          gutterBottom
        >
          {t('resumes.title')}
        </Typography>

        <Typography variant='body2' color='text.secondary'>
          {t('resumes.subtitle')}
        </Typography>
      </Stack>

      {isError && (
        <Alert severity='error' sx={{ borderRadius: 1, mb: 3 }}>
          {t('common.errors.loadFailed')}
        </Alert>
      )}

      <Paper variant='outlined'>
        <Stack
          direction='row'
          sx={{ p: 1.5, alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Button
            component='label'
            variant='contained'
            startIcon={<UploadIcon />}
            disabled={isUploading || resumes.length >= MAX_RESUMES}
          >
            {t('resumes.upload')}
            <input
              hidden
              type='file'
              accept='application/pdf'
              data-testid='resume-upload'
              onChange={selectFile}
            />
          </Button>
          <Typography variant='body2' color='text.secondary'>
            {resumes.length}/{MAX_RESUMES}
          </Typography>
        </Stack>
        <Divider />
        <List
          dense
          sx={{ px: 1, maxHeight: LIST_MAX_HEIGHT, overflowY: 'auto' }}
        >
          {!isError && resumes.length === 0 && (
            <ListItem>
              <ListItemText secondary={t('resumes.empty')} />
            </ListItem>
          )}
          {resumes.map(resume => (
            <ListItem key={resume.id} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={`/resumes/${resume.id}`}
                sx={{ borderRadius: 1, gap: 1 }}
              >
                <ListItemText
                  primary={resume.fileName}
                  slotProps={{ primary: { noWrap: true } }}
                />
                <Typography variant='caption' color='text.secondary'>
                  {new Date(resume.createdAt).toLocaleDateString(i18n.language)}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  )
}

export default Resumes
