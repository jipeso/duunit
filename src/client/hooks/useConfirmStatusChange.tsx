import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type {
  ApplicationResponse,
  ApplicationStatus,
} from '#common/types/applications.ts'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { clearsStatusDates } from '../util/applications'

type Resolve = (confirmed: boolean) => void

const useConfirmStatusChange = () => {
  const { t } = useTranslation()
  const [resolve, setResolve] = useState<Resolve | null>(null)

  const confirm = (
    application: ApplicationResponse,
    status: ApplicationStatus
  ) => {
    if (!clearsStatusDates(application, status)) {
      return Promise.resolve(true)
    }

    return new Promise<boolean>(onDone => {
      setResolve(() => onDone)
    })
  }

  const close = (confirmed: boolean) => {
    resolve?.(confirmed)
    setResolve(null)
  }

  const dialog = (
    <ConfirmDialog
      open={resolve !== null}
      title={t('applications.statusChange.title')}
      message={t('applications.statusChange.message')}
      confirmLabel={t('applications.statusChange.confirm')}
      onConfirm={() => {
        close(true)
      }}
      onClose={() => {
        close(false)
      }}
    />
  )

  return { confirm, dialog }
}

export default useConfirmStatusChange
