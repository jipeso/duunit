import { useTranslation } from 'react-i18next'

import type { ResumeResponse } from '#common/types/resumes.ts'
import useDeleteResume from '../hooks/useDeleteResume'
import { isNotFoundError } from '../util/apiClient'
import ConfirmDialog from './common/ConfirmDialog'
import { useNotification } from './Notification'

interface Props {
  resume: ResumeResponse | null
  open: boolean
  onClose: () => void
  onDeleted?: () => void
}

const DeleteResumeDialog = ({ resume, open, onClose, onDeleted }: Props) => {
  const { t } = useTranslation()
  const { showSuccess } = useNotification()
  const { mutate, isPending, error, reset } = useDeleteResume()

  const close = () => {
    reset()
    onClose()
  }

  const confirm = () => {
    if (!resume) {
      return
    }

    mutate(resume.id, {
      onSuccess: () => {
        showSuccess(t('notifications.resumeDeletedSuccess'))
        close()
        onDeleted?.()
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      title={t('resumes.delete')}
      message={t('resumes.deleteConfirm', {
        fileName: resume?.fileName,
      })}
      confirmLabel={t('common.buttons.delete')}
      onConfirm={confirm}
      onClose={close}
      isPending={isPending}
      error={
        error &&
        t(
          isNotFoundError(error)
            ? 'resumes.notFound'
            : 'common.errors.unexpected'
        )
      }
    />
  )
}

export default DeleteResumeDialog
