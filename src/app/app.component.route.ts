import {Routes} from '@angular/router';
import {ArchetypeHomeComponent} from "./components/archetype-home/archetype-home.component";

export const ROUTES: Routes = [
    {
        title: 'Home',
        path: '',
        component: ArchetypeHomeComponent
    },
    {
        title: 'Structure',
        path: 'structure',
        loadComponent: () =>
            import('./components/archetype-structure/archetype-structure.component')
                .then(view => view.ArchetypeStructureComponent),
    },
    {
        title: 'Error page',
        path: 'erro',
        loadChildren: () =>
            import('./core/error/error.route')
                .then(view => view.ERROR_ROUTES),
    },
    {
        title: '',
        path: '**',
        redirectTo: 'erro',
        pathMatch: 'full'
    }
];
