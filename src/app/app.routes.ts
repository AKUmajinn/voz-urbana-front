import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/layout/dashboard-layout/dashboard-layout').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: 'incidencias',
        loadComponent: () => import('./features/incidencias/components/incidencia-list/incidencia-list').then(m => m.IncidenciaListComponent)
      },
      {
        path: 'incidencias/nueva',
        loadComponent: () => import('./features/incidencias/components/incidencia-create/incidencia-create').then(m => m.IncidenciaCreateComponent)
      },
      {
        path: 'inventario',
        loadComponent: () => import('./features/inventario/components/material-list/material-list').then(m => m.MaterialListComponent)
      },
      {
        path: '',
        redirectTo: 'incidencias',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];