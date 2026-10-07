import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'

import type { StatusEventResponse } from '#common/types/applications.ts'
import useUpdateStatusEvent from '../../hooks/useUpdateStatusEvent'
import { today } from '../../util/date'

interface Props {
  applicationId: string
  event: StatusEventResponse
  min?: string
  max?: string
  onClose: () => void
}

const EditEventDateDialog = ({
  applicationId,
  event,
  min,
  max,
  onClose,
}: Props) => {
  const { t } = useTranslation()
  const { mutate, isPending, error } = useUpdateStatusEvent()
  const [occurredOn, setOccurredOn] = useState(event.occurredOn)

  // The date has to stay between the neighbouring events and can't be in the future
  const upperLimit = max && max < today() ? max : today()
  const isValid =
    occurredOn !== '' && (!min || occurredOn >= min) && occurredOn <= upperLimit

  const save = () => {
    mutate(
      { applicationId, eventId: event.id, occurredOn },
      { onSuccess: onClose }
    )
  }

  return (
    <Dialog
      open
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth='xs'
    >
      <DialogTitle>{t('applications.editEventDate')}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          type='date'
          label={t('fields.eventDate')}
          value={occurredOn}
          onChange={e => {
            setOccurredOn(e.target.value)
          }}
          error={!isValid}
          sx={{ mt: 1 }}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: {
              min,
              max: upperLimit,
              'data-testid': 'event-date',
            },
          }}
        />
        {error && (
          <Alert severity='error' sx={{ mt: 2, borderRadius: 1 }}>
            {t('common.errors.unexpected')}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          {t('common.buttons.cancel')}
        </Button>
        <Button
          onClick={save}
          disabled={isPending || !isValid}
          variant='contained'
          disableElevation
          data-testid='event-date-save'
        >
          {isPending ? (
            <CircularProgress size={20} color='inherit' />
          ) : (
            t('common.buttons.save')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditEventDateDialog
