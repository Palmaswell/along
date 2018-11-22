import { action, observable } from 'mobx';

export enum Language {
  german = 'de-DE',
  english = 'en-US',
  spanish = 'es-CR',
  japanese = 'ja'
}

export interface StoreProps {
  lang: Language;
  intLabels: IntLabelType;
  languages: string[];
  translatedLabels: string[];
  openOverlay: boolean;
  getLanguage(): string;
  setLanguage(lang: Language): void;
  getTranslatedLabels(): IntLabelType;
  toggleOverlay(): void;
}

export interface LanguageInit {
  lang: Language;
  intLabels: IntLabelType;
  languages: string[];
}

export type IntLabelType =
[
  'german',
  'english',
  'spanish',
  'japanese'
]
|
[
  'deutsch',
  'englisch',
  'spanish',
  'japanisch'
]
|
[
  'alemán',
  'inglés',
  'español',
  'japonés'
]
|
[
  'Doitsunin',
  'Eigo',
  'Supeingo',
  'Nihonjin'
];

export const IntLabels = [
  [
    'german',
    'english',
    'spanish',
    'japanese'
  ],
  [
    'deutsch',
    'englisch',
    'spanish',
    'japanisch'
  ],
  [
    'alemán',
    'inglés',
    'español',
    'japonés'
  ],
  [
    'Doitsunin',
    'Eigo',
    'Supeingo',
    'Nihonjin'
  ]
];

export class Store {
  public languages: string[] = [
    'german',
    'english',
    'spanish',
    'japanese'
  ];
  public english: string[] = [
    'german',
    'english',
    'spanish',
    'japanese'
  ];
  public german: string[] = [
    'deutsch',
    'englisch',
    'spanish',
    'japanisch'
  ];
  public spanish: string[] = [
    'alemán',
    'inglés',
    'español',
    'japonés'
  ];
  public japanese: string[] = [
    'Doitsunin',
    'Eigo',
    'Supeingo',
    'Nihonjin'
  ];
  @observable public lang: Language;
  @observable public intLabels: IntLabelType;
  @observable public openOverlay: boolean;

  public constructor(init: LanguageInit, _isServer: boolean) {
    this.lang = init.lang;
    this.intLabels = init.intLabels;
  }

  public getLanguage = (): Language => {
    return this.lang;
  }

  @action public setLanguage = (lang: Language): void => {
    this.lang = lang;
  }

  @action public getTranslatedLabels = (): IntLabelType => {
    switch(this.lang) {
      case Language.german:
        return this.intLabels = [
          'deutsch',
          'englisch',
          'spanish',
          'japanisch'
        ];

      case Language.spanish:
        return this.intLabels = [
          'alemán',
          'inglés',
          'español',
          'japonés'
        ];

      case Language.japanese:
        return this.intLabels = [
          'Doitsunin',
          'Eigo',
          'Supeingo',
          'Nihonjin'
        ];

      case Language.english:
        return this.intLabels = [
          'german',
          'english',
          'spanish',
          'japanese'
        ];

    }
  }
}

export default Store;
