import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import {environment} from './environments/environment';
import {ROUTES} from "./app/app.route";
import {PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading} from "@angular/router";
import {ERROR_ROUTES} from "./app/core/error/error.route";

if (environment.production) {
    console.log('Running in production mode');
} else if (environment.development) {
    console.log('Running in development mode');
}

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        provideRouter(
            ROUTES,
            withInMemoryScrolling({scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled'}),
            withPreloading(PreloadAllModules)
        )
    ]
});