import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import { LANGUAGES } from '#common/types/common.ts'

const LanguageSelect = () => {
  const { i18n, t } = useTranslation()

  const currentLanguage = i18n.resolvedLanguage

  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      void i18n.changeLanguage(event.target.value)
    },
    [i18n]
  )

  return (
    <Select
      value={currentLanguage}
      onChange={handleChange}
      renderValue={value => t(`common.languages.${value}`)}
      inputProps={{ 'aria-label': t('common.languages.label') }}
      variant='standard'
      disableUnderline
      size='small'
      sx={{ minWidth: '7em', color: 'text.primary' }}
    >
      {LANGUAGES.map(language => (
        <MenuItem key={language} value={language}>
          {t(`common.languages.${language}`)}
        </MenuItem>
      ))}
    </Select>
  )
}

export default LanguageSelect
