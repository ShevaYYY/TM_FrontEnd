import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { adminGuard } from './core/guards/admin.guard';
import { clientGuard } from './core/guards/client.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
    
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard] 
  },
  {
    path: 'user',
    loadComponent: () => import('./features/user/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent),
    canActivate: [clientGuard] 
  },
  {
    path: '**', 
    redirectTo: '',
  },
];