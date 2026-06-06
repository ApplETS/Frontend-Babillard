import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { provideTranslocoPersistTranslations } from '@jsverse/transloco-persist-translations';

import { routes } from './app.routes';
import { TranslocoHttpLoader } from './core/systems/i18n/transloco-loader';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';
import { authConfig } from './auth/auth.config';
import {
  AbstractSecurityStorage,
  authInterceptor,
  DefaultLocalStorageService,
  provideAuth
} from 'angular-auth-oidc-client';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideTransloco({
      config: {
        availableLangs: ['en', 'fr'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideTranslocoPersistLang({
      storage: {
        useValue: localStorage,
      },
    }),

    provideTranslocoPersistTranslations({
      loader: TranslocoHttpLoader, // Auto-generated via ng add
      storage: { useValue: localStorage },
    }),
    provideTranslocoLocale(),

    provideRouter(routes),
    provideAuth(authConfig),
    { provide: AbstractSecurityStorage, useClass: DefaultLocalStorageService },
  ],
};
