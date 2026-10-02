import { useTranslation } from 'react-i18next'

import type { ApplicationResponse } from '#common/types/applications.ts'
import useDeleteApplication from '../hooks/useDeleteApplication'
import ConfirmDialog from './common/ConfirmDialog'
import { useNotification } from './Notification'

interface Props {
  application: ApplicationResponse | null
  open: boolean
  onClose: () => void
  onDeleted?: () => void
}

const DeleteApplicationDialog = ({
  application,
  open,
  onClose,
  onDeleted,
}: Props) => {
  const { t } = useTranslation()
  const { showSuccess } = useNotification()
  const { mutate, isPending, isError, reset } = useDeleteApplication()

  const close = () => {
    reset()
    onClose()
  }

  const confirm = () => {
    if (!application) {
      return
    }

    mutate(application.id, {
      onSuccess: () => {
        showSuccess(t('notifications.applicationDeletedSuccess'))
        close()
        onDeleted?.()
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      title={t('applications.delete')}
      message={t('applications.deleteConfirm', {
        company: application?.company,
        position: application?.position,
      })}
      confirmLabel={t('common.buttons.delete')}
      onConfirm={confirm}
      onClose={close}
      isPending={isPending}
      error={isError ? t('common.errors.unexpected') : null}
    />
  )
}

export default DeleteApplicationDialog
