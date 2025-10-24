import {Routes} from '@angular/router';
import {ArchetypeHomeAppComponent} from "./components/archetype-home-app/archetype-home-app.component";

export const ROUTES: Routes = [
    {
        title: 'Home',
        path: '',
        component: ArchetypeHomeAppComponent
    },
    {
        title: 'Structure',
        path: 'structure',
        loadComponent: () =>
            import('./components/archetype-structure-app/archetype-structure.component')
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
