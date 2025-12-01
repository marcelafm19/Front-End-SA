import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// IMPORTA LOCALE PT-BR
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// REGISTRA PT-BR
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),

    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};

export const appSettings = {
   apiBaseUrl : 'https://ds-projeto-back.onrender.com'
   //apiBaseUrl : 'http://localhost:8080'
};