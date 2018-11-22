import Cookie from 'js-cookie';
import Store, { Language } from './store';

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
