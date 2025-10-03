import {Component} from '@angular/core';
import {ArchetypeTitleAppComponent} from "./components/archetype-title-app/archetype-title-app.component";
import {ArchetypeHomeComponent} from "./components/archetype-home/archetype-home.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ArchetypeTitleAppComponent, ArchetypeHomeComponent, TranslateModule],
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
