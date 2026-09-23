import i18n from 'i18next'
import HttpApi from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

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
    saveMissing: inDevelopment,
  })

export default i18n
