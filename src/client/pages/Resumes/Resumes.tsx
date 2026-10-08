import { useState, type ChangeEvent } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import UploadIcon from '@mui/icons-material/Upload'
import { useTranslation } from 'react-i18next'

import {
  MAX_RESUME_BYTES,
  MAX_RESUMES,
  type ResumeResponse,
} from '#common/types/resumes.ts'
import useResumes from '../../hooks/useResumes'
import useUploadResume from '../../hooks/useUploadResume'
import useDeleteResume from '../../hooks/useDeleteResume'
import { resumeFileUrl } from '../../util/resumes'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useNotification } from '../../components/Notification'

const PANEL_HEIGHT = '65vh'
const VIEWER_PARAMS = 'toolbar=0&navpanes=0&view=FitH'

interface MenuState {
  anchor: HTMLElement | null
  resume: ResumeResponse
}

const Resumes = () => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const isTooSmallToPreview = useMediaQuery(theme.breakpoints.down('lg'))
  const { showSuccess, showError } = useNotification()
  const { data: resumes = [], isPending, isError } = useResumes()
  const { mutate: upload, isPending: isUploading } = useUploadResume()
  const {
    mutate: removeResume,
    isPending: isDeleting,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteResume()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [resumeToDelete, setResumeToDelete] = useState<ResumeResponse | null>(
    null
  )
  const [menu, setMenu] = useState<MenuState | null>(null)

  if (isPending) {
    return <CircularProgress />
  }

  const selected = resumes.find(({ id }) => id === selectedId)
  const query = search.trim().toLowerCase()
  const filtered = resumes.filter(({ fileName }) =>
    fileName.toLowerCase().includes(query)
  )
  const isAtLimit = resumes.length >= MAX_RESUMES

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

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

  const closeDialog = () => {
    resetDelete()
    setResumeToDelete(null)
  }

  const confirmDelete = () => {
    if (!resumeToDelete) return

    removeResume(resumeToDelete.id, {
      onSuccess: () => {
        showSuccess(t('notifications.resumeDeletedSuccess'))
        closeDialog()
      },
    })
  }

  const closeMenu = () => {
    setMenu(current => current && { ...current, anchor: null })
  }

  const openResume = (id: string) => {
    if (isTooSmallToPreview) {
      window.open(resumeFileUrl(id), '_blank', 'noopener')
    } else {
      setSelectedId(id === selectedId ? null : id)
    }
  }

  return (
    <Container maxWidth='md' sx={{ mt: 4, mb: 8 }}>
      <Typography component='h1' variant='h5' sx={{ mb: 3 }}>
        {t('resumes.title')}
      </Typography>

      {isError && (
        <Alert severity='error' sx={{ borderRadius: 1, mb: 3 }}>
          {t('common.errors.loadFailed')}
        </Alert>
      )}

      <Stack direction='row' spacing={2}>
        <Paper
          variant='outlined'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            width: isTooSmallToPreview ? '100%' : 280,
            height: PANEL_HEIGHT,
          }}
        >
          <Stack spacing={1.5} sx={{ p: 1.5 }}>
            <Tooltip
              title={
                isAtLimit ? t('resumes.limitReached', { max: MAX_RESUMES }) : ''
              }
            >
              <Box component='span' sx={{ alignSelf: 'flex-start' }}>
                <Button
                  component='label'
                  variant='contained'
                  startIcon={<UploadIcon />}
                  disabled={isUploading || isAtLimit}
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
              </Box>
            </Tooltip>
            <TextField
              size='small'
              placeholder={t('resumes.search')}
              value={search}
              onChange={e => {
                setSearch(e.target.value)
              }}
            />
          </Stack>
          <Divider />
          <List
            dense
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              px: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            {!isError && filtered.length === 0 && (
              <ListItem>
                <ListItemText
                  secondary={t(
                    resumes.length ? 'resumes.noMatches' : 'resumes.empty'
                  )}
                />
              </ListItem>
            )}
            {filtered.map(resume => (
              <ListItem
                key={resume.id}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge='end'
                    size='small'
                    aria-label={t('common.moreActions')}
                    onClick={e => {
                      setMenu({ anchor: e.currentTarget, resume })
                    }}
                  >
                    <MoreVertIcon fontSize='small' />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={resume.id === selectedId}
                  onClick={() => {
                    openResume(resume.id)
                  }}
                  sx={{ borderRadius: 1, gap: 1 }}
                >
                  <ListItemText
                    primary={resume.fileName}
                    slotProps={{ primary: { noWrap: true } }}
                  />
                  <Typography variant='caption' color='text.secondary'>
                    {new Date(resume.createdAt).toLocaleDateString(
                      i18n.language
                    )}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>

        {!isTooSmallToPreview &&
          (selected ? (
            <Box
              component='iframe'
              src={`${resumeFileUrl(selected.id)}#${VIEWER_PARAMS}`}
              title={selected.fileName}
              sx={{
                flexGrow: 1,
                minWidth: 0,
                height: PANEL_HEIGHT,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
              }}
            />
          ) : (
            <Paper
              variant='outlined'
              sx={{ flexGrow: 1, height: PANEL_HEIGHT }}
            />
          ))}
      </Stack>

      <Menu anchorEl={menu?.anchor} open={!!menu?.anchor} onClose={closeMenu}>
        <MenuItem
          component='a'
          href={menu ? resumeFileUrl(menu.resume.id) : undefined}
          download
          onClick={closeMenu}
        >
          {t('resumes.download')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setResumeToDelete(menu?.resume ?? null)
            closeMenu()
          }}
        >
          {t('common.buttons.delete')}
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={resumeToDelete !== null}
        title={t('resumes.delete')}
        message={t('resumes.deleteConfirm', {
          fileName: resumeToDelete?.fileName,
        })}
        confirmLabel={t('common.buttons.delete')}
        onConfirm={confirmDelete}
        onClose={closeDialog}
        isPending={isDeleting}
        error={deleteError && t('common.errors.unexpected')}
      />
    </Container>
  )
}

export default Resumes
