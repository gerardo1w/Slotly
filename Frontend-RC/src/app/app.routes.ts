import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./page/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./page/home/home').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'complex',
    loadComponent: () => import('./page/complex/complex').then(m => m.ComplexComponent),
    canActivate: [authGuard],
    data: { roles: ['client'] }
  },
  {
    path: 'booking',
    loadComponent: () => import('./page/booking/booking').then(m => m.BookingComponent),
    canActivate: [authGuard],
    data: { roles: ['client'] }
  },
  {
    path: 'owner',
    loadComponent: () => import('./page/owner/owner').then(m => m.OwnerDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['owner'] }
  },
  {
    path: 'admin',
    loadComponent: () => import('./page/admin/admin').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
