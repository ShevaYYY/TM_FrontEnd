import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  
  if (authService.isAuthenticated()) {
    
    const userRole = authService.currentUser?.role;
    if (userRole === 'admin') {
      router.navigate(['/admin']);
    } else if (userRole === 'client') {
      router.navigate(['/user']);
    }
    return false; 
  }
  return true;
};