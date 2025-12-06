import {Component} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {PageHomeComponent} from "./components/dashboard-view/page-home/page-home.component";
import {PageTitleComponent} from "./components/dashboard-view/page-title/page-title.component";
import {PageEndComponent} from "./components/dashboard-view/page-end/page-end.component";
import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        TranslateModule,
        PageTitleComponent,
        PageHomeComponent,
        PageEndComponent,
        RouterOutlet
    ],
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
