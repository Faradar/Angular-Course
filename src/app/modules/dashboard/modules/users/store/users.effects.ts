import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersActions } from './users.actions';
import { catchError, concatMap, map, mergeMap, of } from 'rxjs';
import { UsersService } from '../users.service';

@Injectable()
export class UsersEffects {
  loadUsers$;
  createUser$;
  updateUser$;
  deleteUser$;

  constructor(private actions$: Actions, private usersService: UsersService) {
    // Load
    this.loadUsers$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UsersActions.loadUsers),
        mergeMap(() =>
          this.usersService.getUsers().pipe(
            map((users) => UsersActions.loadUsersSuccess({ users })),
            catchError((err) =>
              of(UsersActions.loadUsersFailure({ error: err.message }))
            )
          )
        )
      )
    );

    // Create
    this.createUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UsersActions.createUser),
        concatMap(({ user }) =>
          this.usersService.createUser(user).pipe(
            map((newUser) => UsersActions.createUserSuccess({ user: newUser })),
            catchError((err) =>
              of(UsersActions.createUserFailure({ error: err.message }))
            )
          )
        )
      )
    );

    // Update
    this.updateUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UsersActions.updateUser),
        mergeMap(({ user }) =>
          this.usersService.updateUser(user).pipe(
            map((updatedUser) =>
              UsersActions.updateUserSuccess({ user: updatedUser })
            ),
            catchError((err) =>
              of(UsersActions.updateUserFailure({ error: err.message }))
            )
          )
        )
      )
    );

    // Delete
    this.deleteUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UsersActions.deleteUser),
        mergeMap(({ id }) =>
          this.usersService.deleteUser(id).pipe(
            map(() => UsersActions.deleteUserSuccess({ id })),
            catchError((err) =>
              of(UsersActions.deleteUserFailure({ error: err.message }))
            )
          )
        )
      )
    );
  }
}
