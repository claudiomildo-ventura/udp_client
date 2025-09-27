import {Component} from '@angular/core';
import {ArchetypeTitleAppComponent} from "./components/archetype-title-app/archetype-title-app.component";
import {ArchetypeHomeComponent} from "./components/archetype-home/archetype-home.component";
import {ArchetypeStructureComponent} from "./components/archetype-structure/archetype-structure.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ArchetypeTitleAppComponent, ArchetypeHomeComponent, ArchetypeStructureComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
}
