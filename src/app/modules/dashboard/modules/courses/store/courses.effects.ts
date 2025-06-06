import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CoursesActions } from './courses.actions';
import { catchError, concatMap, map, mergeMap, of, exhaustMap } from 'rxjs';
import { CoursesService } from '../courses.service';

@Injectable()
export class CoursesEffects {
  loadCourses$;
  createCourse$;
  updateCourse$;
  deleteCourse$;

  constructor(
    private actions$: Actions,
    private coursesService: CoursesService
  ) {
    // Load all courses
    this.loadCourses$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CoursesActions.loadCourses),
        exhaustMap(() =>
          this.coursesService.getCourses().pipe(
            map((courses) => CoursesActions.loadCoursesSuccess({ courses })),
            catchError((err) =>
              of(CoursesActions.loadCoursesFailure({ error: err.message }))
            )
          )
        )
      )
    );

    // Create a new course
    this.createCourse$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CoursesActions.createCourse),
        concatMap(({ course }) =>
          this.coursesService.createCourse(course).pipe(
            map((newCourse) =>
              CoursesActions.createCourseSuccess({ course: newCourse })
            ),
            catchError((err) =>
              of(CoursesActions.createCourseFailure({ error: err.message }))
            )
          )
        )
      )
    );

    // Update an existing course
    this.updateCourse$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CoursesActions.updateCourse),
        mergeMap(({ course }) =>
          this.coursesService.updateCourse(course).pipe(
            map((updated) =>
              CoursesActions.updateCourseSuccess({ course: updated })
            ),
            catchError((err) =>
              of(CoursesActions.updateCourseFailure({ error: err.message }))
            )
          )
        )
      )
    );

    // Delete a course
    this.deleteCourse$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CoursesActions.deleteCourse),
        mergeMap(({ id }) =>
          this.coursesService.deleteCourse(id).pipe(
            map(() => CoursesActions.deleteCourseSuccess({ id })),
            catchError((err) =>
              of(CoursesActions.deleteCourseFailure({ error: err.message }))
            )
          )
        )
      )
    );
  }
}
