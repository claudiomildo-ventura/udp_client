import {Component} from '@angular/core';
import {ArchetypeTitleAppComponent} from "./components/archetype-title-app/archetype-title-app.component";
import {ArchetypeHomeAppComponent} from "./components/archetype-home-app/archetype-home-app.component";
import {TranslateModule} from "@ngx-translate/core";
import {ArchetypeFooterAppComponent} from "./components/archetype-footer-app/archetype-footer-app.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        ArchetypeTitleAppComponent,
        ArchetypeHomeAppComponent,
        TranslateModule,
        ArchetypeFooterAppComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    /*constructor(private translate: TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

    changeLanguage(language: string) {
        this.translate.use(language);  // Change the language dynamically
    }*/
}
