import { action, observable } from 'mobx';

export enum Language {
  german = 'de-DE',
  english = 'en-US',
  spanish = 'es-CR',
  japanese = 'ja'
}

export interface LanguageInit {
  lang: Language;
  availableLang: string[];
}

export type LangLabel = [
  'german',
  'english',
  'spanish',
  'japanese'
];

export class LangStore {
  public availableLang: LangLabel;
  @observable public lang: Language = Language.english;
  @observable public langLabel: string = 'english';

  public constructor(init: LanguageInit, _isServer: boolean) {
    this.lang = init.lang;
    this.availableLang = ['german', 'english', 'spanish', 'japanese'];
  }

  public getLanguage = (): Language => {
    return this.lang;
  }

  @action public setLanguage = (lang: Language): void => {
    this.lang = lang;
  }

  @action public getTranslatedLabel = (): string => {
    switch(this.lang) {
      case Language.german:
        this.langLabel = 'deutsch';
      case Language.spanish:
        this.langLabel = 'español';
      case Language.japanese:
        this.langLabel = 'nihonjin';
      case Language.english:
        this.langLabel = 'english'
    }
    return this.langLabel;
  }
}

export default LangStore;
