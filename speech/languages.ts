export enum Language {
  german = 'de-DE',
  english = 'en-US',
  spanish = 'es-CR',
  japanese = 'ja'
}

export const languages = ['german', 'english', 'spanish', 'japanese']

export const setLanguage = (lang: Language): Language =>  {
  switch(lang) {
    case Language.german:
      return Language.german;
    case Language.spanish:
      return Language.spanish;
    case Language.japanese:
      return Language.japanese;
    case Language.english:
    default:
      return Language.english;
  }
}

// export const translateLangCaption = (lang: langugae): string => {

// };
