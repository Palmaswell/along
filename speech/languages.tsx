import { Observable } from 'rxjs';

//-- $todo: language selection
export const languages = Observable.from(
  [
    {
      lang: 'English',
      countries: {
        'Australia': 'en-AU',
        'Canada': 'en-CA',
        'New Zealand': 'en-NZ',
        'South Africa': 'en-ZA',
        'United Kingdom': 'en-GB',
        'United States': 'en-US'
      }
    },
    {
      lang: 'Español',
      countries: {
        'Argentina': 'es-AR',
        'Chile': 'es-CL',
        'Costa Rica': 'es-CR',
        'España': 'es-ES',
        'Estados Unidos': 'es-US',
        'México': 'es-MX'
      }
    },
    {
      lang: 'Deutsch',
      countries: {
        'Austria': 'de-AT',
        'Germany': 'de-DE',
        'Liechtenstein': 'de-LI',
        'Luxembourg': 'de-LU',
        'Switzerland': 'de-CH',
      }
    }
  ]
);

export default languages;
