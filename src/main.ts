import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideHttpClient} from '@angular/common/http';
import {environment} from './environments/environment';
import {routes} from "./app/app.component.route";
import {provideRouter} from "@angular/router";

if (environment.production) {
  //enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(), provideRouter(routes)]
}).catch(ex => console.error(ex));
