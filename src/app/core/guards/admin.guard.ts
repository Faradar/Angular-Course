import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.authUser$.pipe(
    map((user) => {
      if (user && user.role === 'admin') {
        return true;
      } else {
        alert('You do not have permission to access this page');
        router.navigate(['/dashboard']);
        return false;
      }
    })
  );
};
