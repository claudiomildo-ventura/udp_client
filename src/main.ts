import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideHttpClient} from '@angular/common/http';
import {environment} from './environments/environment';
import {ROUTES} from "./app/app.component.route";
import {provideRouter} from "@angular/router";

if (environment.production) {
    console.log('Running in production mode');
} else if (environment.development) {
    console.log('Running in development mode');
}

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(), provideRouter(ROUTES)]
}).catch(ex => console.error(ex));
