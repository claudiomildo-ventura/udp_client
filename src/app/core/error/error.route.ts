import {Routes} from '@angular/router';

export const ERROR_ROUTES: Routes = [
    {
        title: 'Error',
        path: '',
        loadComponent: () =>
            import('./erro-default/erro-default.component')
                .then(view => view.ErroDefaultComponent)
    },
];