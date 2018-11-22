import Cookie from 'js-cookie';
import Store, { Language, IntLabels } from './store';

const isServer: boolean = typeof window === 'undefined';
let store = null;

export const initializeStore = (init): Store => {
  if (isServer) {
    return new Store(init, isServer);
  }
  if (store === null) {
    store = new Store(init, isServer);
  }
  return store
};

export const initializeLang = (langCookie: Language, isServer: boolean): Language => {
  let lang;
  if (isServer) {
    lang = langCookie;
  }
  if (lang === Cookie.get('lang')) {
    lang = Language.english;
  }
  return lang;
}


export const initializeLabels = (lang: Language): string[] => {
  switch(lang) {
    case Language.german:
      return IntLabels[1];
    case Language.spanish:
      return IntLabels[2];
    case Language.japanese:
      return IntLabels[3];
    case Language.english:
      return IntLabels[1];
  }
}
