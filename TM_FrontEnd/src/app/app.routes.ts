import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { clientGuard } from './core/guards/client.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/user', 
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./dashboard/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard] 
  },
  {
    path: 'user',
    loadComponent: () => import('./dashboard/user/user-dashboard.component').then(m => m.UserDashboardComponent),
    canActivate: [clientGuard] 
  }
];