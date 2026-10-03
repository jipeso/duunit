import { useColorScheme } from '@mui/material/styles'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import { useTranslation } from 'react-i18next'

import { THEMES, type Theme } from '#common/types/common.ts'

const themeIcons: Record<Theme, React.ReactNode> = {
  light: <LightModeIcon fontSize='small' />,
  dark: <DarkModeIcon fontSize='small' />,
  system: <SettingsBrightnessIcon fontSize='small' />,
}

const ThemeSelect = () => {
  const { mode, setMode } = useColorScheme()
  const { t } = useTranslation()

  return (
    <ToggleButtonGroup
      value={mode ?? 'system'}
      exclusive
      color='primary'
      fullWidth
      size='small'
      onChange={(_, value: Theme | null) => {
        if (value) {
          setMode(value)
        }
      }}
      aria-label={t('common.themes.label')}
    >
      {THEMES.map(theme => (
        <ToggleButton key={theme} value={theme} sx={{ gap: 0.5 }}>
          {themeIcons[theme]}
          {t(`common.themes.${theme}`)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default ThemeSelect
