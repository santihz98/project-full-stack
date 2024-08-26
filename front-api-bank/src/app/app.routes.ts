import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/shared/layout/layout.component'),
    children: [
      {
        path: 'clients',
        loadComponent: () =>
          import('./components/client/client-detail/client-detail.component'),
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import(
            './components/account/account-detail/account-detail.component'
          ),
      },
      {
        path: 'transaction',
        loadComponent: () =>
          import(
            './components/transaction/transaction-detail/transaction-detail.component'
          ),
      },
      {
        path: '',
        redirectTo: 'clients',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'clients',
  },
];
