import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectAuthToken } from '../../store/auth/auth.selectors';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);

  return store.pipe(
    select(selectAuthToken),
    take(1),
    map((token) => {
      if (token) {
        return true;
      } else {
        router.navigate(['/auth/login']);
        return false;
      }
    })
  );
};
