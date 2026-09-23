import { useColorScheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { THEMES, type Theme } from '#common/types/common.ts'

const ThemeSelect = () => {
  const { mode, setMode } = useColorScheme()
  const { t } = useTranslation()

  const currentMode = mode ?? 'system'

  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      setMode(event.target.value as Theme)
    },
    [setMode]
  )

  return (
    <Select
      value={currentMode}
      onChange={handleChange}
      renderValue={value => t(`common.themes.${value}`)}
      inputProps={{ 'aria-label': t('common.themes.label') }}
      variant='standard'
      disableUnderline
      size='small'
      sx={{ minWidth: '7em', color: 'text.primary' }}
    >
      {THEMES.map(theme => (
        <MenuItem key={theme} value={theme}>
          {t(`common.themes.${theme}`)}
        </MenuItem>
      ))}
    </Select>
  )
}

export default ThemeSelect
