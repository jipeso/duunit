import i18n from 'i18next'
import HttpApi from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { z } from 'zod'

import { inDevelopment } from './config.ts'
import { LANGUAGES } from '#common/types/common.ts'

void i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    supportedLngs: LANGUAGES,
    preload: LANGUAGES,
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
