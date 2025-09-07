import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const clientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  
  if (authService.isAuthenticated() && authService.currentUser?.role === 'client') {
    return true;
  }

  
  router.navigate(['/admin']);
  return false;
};