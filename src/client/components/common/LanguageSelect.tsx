import { useTranslation } from 'react-i18next'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

import { LANGUAGES, type LanguageId } from '#common/types/common.ts'

const languageNames: Record<LanguageId, string> = {
  fi: 'Suomi',
  en: 'English',
  sv: 'Svenska',
}

const LanguageSelect = () => {
  const { i18n, t } = useTranslation()

  return (
    <ToggleButtonGroup
      value={i18n.resolvedLanguage}
      exclusive
      color='primary'
      fullWidth
      size='small'
      onChange={(_, value: LanguageId | null) => {
        if (value) {
          void i18n.changeLanguage(value)
        }
      }}
      aria-label={t('common.languages.label')}
    >
      {LANGUAGES.map(language => (
        <ToggleButton
          key={language}
          value={language}
          lang={language}
          sx={{ textTransform: 'none' }}
        >
          {languageNames[language]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default LanguageSelect
