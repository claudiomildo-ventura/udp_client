/**
 {*******************************************************************************}
 {                                                                               }
 {                          Unified Development Platform                         }
 {                                                                               }
 { Copyright(c) 2020-2025 CV IT Consulting and Services - Claudiomildo Ventura   }
 {                                                                               }
 {*******************************************************************************}
 */

import {AppComponent} from './app/app.component';
import {bootstrapApplication} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {PreloadAllModules, provideRouter, Route, withInMemoryScrolling, withPreloading} from "@angular/router";
import {ENVIRONMENT} from './environments/environment';
import {ROUTES} from "./app/app.route";
import {ERROR_ROUTES} from "./app/core/error/error.route";
import {TECHNICAL_LOGGER} from "./config/technical-logger";
import {Interceptor} from "./app/core/interceptor/interceptor";
import { provideAnimations } from '@angular/platform-browser/animations';

export const ALL_ROUTES: Route[] = [...ROUTES, ...ERROR_ROUTES];

if (ENVIRONMENT.production) {
    TECHNICAL_LOGGER.info('It is running in production mode.');
} else if (ENVIRONMENT.development) {
    TECHNICAL_LOGGER.info('It is running in development mode.');
}

bootstrapApplication(AppComponent, {
    providers: [
        provideAnimations(), // for Angular Material
        {
            provide: HTTP_INTERCEPTORS, useClass: Interceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(ALL_ROUTES,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled'
            })
        ),
    ]
}).then(r => console.log(r));