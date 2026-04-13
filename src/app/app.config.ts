import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { provideTranslocoPersistTranslations } from '@jsverse/transloco-persist-translations';

import { routes } from './app.routes';
import { TranslocoHttpLoader } from './core/systems/i18n/transloco-loader';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'fr'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideTranslocoPersistTranslations({
      loader: TranslocoHttpLoader, // Auto-generated via ng add
      storage: { useValue: localStorage },
    }),
    provideTranslocoLocale(),

    provideRouter(routes),
  ],
};
