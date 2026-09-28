import { useColorScheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useTranslation } from 'react-i18next'

import { THEMES, type Theme } from '#common/types/common.ts'

const ThemeSelect = () => {
  const { mode, setMode } = useColorScheme()
  const { t } = useTranslation()

  return (
    <Select<Theme>
      value={mode ?? 'system'}
      onChange={event => {
        setMode(event.target.value)
      }}
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
