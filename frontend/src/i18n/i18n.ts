import { getLang } from './language.js'
import { welcomeTranslations } from '../translations/welcome.js'

const translationsMap = {
  welcome: welcomeTranslations,
  // tu pourras ajouter guest, profile, etc.
}

export function getTranslation(page: keyof typeof translationsMap) {
  const lang = getLang()
  return translationsMap[page][lang as keyof typeof translationsMap[typeof page]]
}
