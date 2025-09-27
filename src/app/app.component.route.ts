import {Routes} from '@angular/router';
import {ArchetypeHomeComponent} from "./components/archetype-home/archetype-home.component";
import {ArchetypeStructureComponent} from "./components/archetype-structure/archetype-structure.component";

export const routes: Routes = [
    {
        path: '',
        component: ArchetypeHomeComponent
    },
    {
        path: 'structure',
        component: ArchetypeStructureComponent
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
