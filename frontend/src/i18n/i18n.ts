import { getLang } from './language.js'
import { welcomeTranslations } from '../translations/welcome.js'
import { navbarTranslations } from '../translations/navbar.js'
import { languageTranslations } from '../translations/language.js'
import { gameTranslations, localPlayTranslations } from '../translations/game.js';
import { tournamentsTranslations } from '../translations/tournaments.js';
import { profileTranslations } from '../translations/profile.js';
import { editProfileTranslations } from '../translations/editProfile.js';


const translationsMap = {
  welcome: welcomeTranslations,
  navbar: navbarTranslations,
  language: languageTranslations,
  game: gameTranslations,
  localPlay: localPlayTranslations,
  tournaments: tournamentsTranslations,
  profile: profileTranslations,
  editProfile: editProfileTranslations
}

export function getTranslation<
  Page extends keyof typeof translationsMap,
  Key extends keyof typeof translationsMap[Page]
>(
  page: Page,
  key: Key
): string {
  const lang = getLang()
  const pageTranslations = translationsMap[page]
  const entry = pageTranslations[key] as Record<string, string>
  return entry[lang]
}
