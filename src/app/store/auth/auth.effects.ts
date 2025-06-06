import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  login$;
  loginRedirect$;
  verifyToken$;
  logoutRedirect$;

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {
    // Login
    this.login$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(AuthActions.login),
        mergeMap(({ email, password }) =>
          this.authService.loginApi(email, password).pipe(
            map((user) => AuthActions.loginSuccess({ user })),
            catchError((err) =>
              of(AuthActions.loginFailure({ error: err.message }))
            )
          )
        )
      );
    });

    // Login Success
    this.loginRedirect$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.loginSuccess),
          tap(() => {
            this.router.navigate(['/dashboard']);
          })
        ),
      { dispatch: false }
    );

    // Token
    this.verifyToken$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(AuthActions.verifyToken),
        mergeMap(() =>
          this.authService.verifyToken().pipe(
            map((res) => {
              if (typeof res !== 'boolean') {
                return AuthActions.verifyTokenSuccess({ user: res });
              } else {
                throw new Error('Token invalid');
              }
            }),
            catchError((err) =>
              of(AuthActions.verifyTokenFailure({ error: err.message }))
            )
          )
        )
      );
    });

    // Logout
    this.logoutRedirect$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.logout),
          tap(() => {
            this.router.navigate(['/auth/login']);
          })
        ),
      { dispatch: false }
    );
  }
}
