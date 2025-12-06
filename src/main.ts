import {AppComponent} from './app/app.component';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {PreloadAllModules, provideRouter, Route, withInMemoryScrolling, withPreloading} from "@angular/router";
import {ENVIRONMENT} from './environments/environment';
import {ROUTES} from "./app/app.route";
import {ERROR_ROUTES} from "./app/core/error/error.route";

export const ALL_ROUTES: Route[] = [...ROUTES, ...ERROR_ROUTES];

if (ENVIRONMENT.production) {
    console.log('It is running in production mode.');
} else if (ENVIRONMENT.development) {
    console.log('It is running in development mode.');
}

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        provideRouter(
            ALL_ROUTES,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled'
            })
        )
    ]
});