import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EnrollmentsActions } from './enrollments.actions';
import { catchError, concatMap, map, mergeMap, of, exhaustMap } from 'rxjs';
import { EnrollmentsService } from '../enrollments.service';

@Injectable()
export class EnrollmentsEffects {
  loadEnrollments$;
  createEnrollment$;
  updateEnrollment$;
  deleteEnrollment$;

  constructor(
    private actions$: Actions,
    private enrollmentsService: EnrollmentsService
  ) {
    // Load all
    this.loadEnrollments$ = createEffect(() =>
      this.actions$.pipe(
        ofType(EnrollmentsActions.loadEnrollments),
        exhaustMap(() =>
          this.enrollmentsService.getEnrollments().pipe(
            map((list) =>
              EnrollmentsActions.loadEnrollmentsSuccess({ enrollments: list })
            ),
            catchError((err) =>
              of(
                EnrollmentsActions.loadEnrollmentsFailure({
                  error: err.message,
                })
              )
            )
          )
        )
      )
    );

    // Create
    this.createEnrollment$ = createEffect(() =>
      this.actions$.pipe(
        ofType(EnrollmentsActions.createEnrollment),
        concatMap(({ enrollment }) =>
          this.enrollmentsService.createEnrollment(enrollment).pipe(
            map((newEnroll) =>
              EnrollmentsActions.createEnrollmentSuccess({
                enrollment: newEnroll,
              })
            ),
            catchError((err) =>
              of(
                EnrollmentsActions.createEnrollmentFailure({
                  error: err.message,
                })
              )
            )
          )
        )
      )
    );

    // Update
    this.updateEnrollment$ = createEffect(() =>
      this.actions$.pipe(
        ofType(EnrollmentsActions.updateEnrollment),
        mergeMap(({ enrollment }) =>
          this.enrollmentsService.updateEnrollment(enrollment).pipe(
            map((updated) =>
              EnrollmentsActions.updateEnrollmentSuccess({
                enrollment: updated,
              })
            ),
            catchError((err) =>
              of(
                EnrollmentsActions.updateEnrollmentFailure({
                  error: err.message,
                })
              )
            )
          )
        )
      )
    );

    // Delete
    this.deleteEnrollment$ = createEffect(() =>
      this.actions$.pipe(
        ofType(EnrollmentsActions.deleteEnrollment),
        mergeMap(({ id }) =>
          this.enrollmentsService.deleteEnrollment(id).pipe(
            map(() => EnrollmentsActions.deleteEnrollmentSuccess({ id })),
            catchError((err) =>
              of(
                EnrollmentsActions.deleteEnrollmentFailure({
                  error: err.message,
                })
              )
            )
          )
        )
      )
    );
  }
}
