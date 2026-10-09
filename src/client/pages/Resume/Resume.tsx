import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link as RouterLink, useNavigate } from 'react-router'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Stack from '@mui/material/Stack'

import DeleteResumeDialog from '../../components/DeleteResumeDialog'
import useResumes from '../../hooks/useResumes'
import { resumeFileUrl } from '../../util/resumes'
import type { ResumeResponse } from '#common/types/resumes.ts'

const PANEL_HEIGHT = '65vh'
const VIEWER_PARAMS = 'toolbar=0&navpanes=0&view=FitH'

const ResumeDetails = ({ resume }: { resume: ResumeResponse }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <Stack spacing={2}>
      <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
        <Button
          component={RouterLink}
          to='/resumes'
          startIcon={<ArrowBackIcon />}
        >
          {t('resumes.backToList')}
        </Button>

        <Button href={resumeFileUrl(resume.id)} download>
          {t('resumes.download')}
        </Button>
      </Stack>

      <Typography component='h1' variant='h5'>
        {resume.fileName}
      </Typography>

      <Stack spacing={2}>
        <Box
          component='iframe'
          src={`${resumeFileUrl(resume.id)}#${VIEWER_PARAMS}`}
          title={resume.fileName}
          sx={{
            height: PANEL_HEIGHT,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            color='error'
            data-testid='resume-details-delete'
            onClick={() => {
              setDeleteDialogOpen(true)
            }}
          >
            {t('common.buttons.delete')}
          </Button>
        </Box>

        <DeleteResumeDialog
          resume={resume}
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false)
          }}
          onDeleted={() => {
            void navigate('/resumes')
          }}
        />
      </Stack>
    </Stack>
  )
}

const Resume = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { data: resumes, isPending, isError } = useResumes()

  if (isPending) {
    return <CircularProgress />
  }

  const resume = resumes?.find(r => r.id === id)

  return (
    <Container maxWidth='sm' sx={{ mt: 4, mb: 8 }}>
      {resume ? (
        <ResumeDetails key={resume.id} resume={resume} />
      ) : (
        <Alert
          severity={isError ? 'error' : 'warning'}
          sx={{ borderRadius: 1 }}
        >
          {t(isError ? 'common.errors.loadFailed' : 'resumes.notFound')}
        </Alert>
      )}
    </Container>
  )
}

export default Resume
