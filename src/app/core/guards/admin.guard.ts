import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectAuthUser } from '../../store/auth/auth.selectors';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);

  return store.pipe(
    select(selectAuthUser),
    take(1),
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
