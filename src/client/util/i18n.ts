import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { z } from 'zod'

import { inDevelopment } from './config.ts'
import { LANGUAGES } from '#common/types/common.ts'
import en from '../locales/en.json'
import fi from '../locales/fi.json'
import sv from '../locales/sv.json'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    resources: {
      en: { translation: en },
      fi: { translation: fi },
      sv: { translation: sv },
    },
    supportedLngs: LANGUAGES,
    debug: inDevelopment,
  })

z.config({
  customError: iss => {
    const field = i18n.t(`fields.${String(iss.path?.at(-1))}`)

    switch (iss.code) {
      case 'too_small':
        return iss.minimum === 1
          ? i18n.t('validation.required', { field })
          : i18n.t('validation.tooShort', {
              field,
              count: Number(iss.minimum),
            })
      case 'too_big':
        return i18n.t('validation.tooLong', {
          field,
          count: Number(iss.maximum),
        })
      case 'invalid_format':
      case 'invalid_type':
      case 'invalid_value':
        return i18n.t('validation.invalid', { field })
    }
  },
})

export default i18n
