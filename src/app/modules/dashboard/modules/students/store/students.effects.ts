import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StudentsActions } from './students.actions';
import { catchError, concatMap, map, of, mergeMap, exhaustMap } from 'rxjs';
import { StudentsService } from '../students.service';

@Injectable()
export class StudentsEffects {
  loadStudents$;
  createStudent$;
  updateStudent$;
  deleteStudent$;

  constructor(
    private actions$: Actions,
    private studentsService: StudentsService
  ) {
    // Load
    this.loadStudents$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(StudentsActions.loadStudents),
        exhaustMap(() =>
          this.studentsService.getStudents().pipe(
            map((students) =>
              StudentsActions.loadStudentsSuccess({ students })
            ),
            catchError((err) =>
              of(
                StudentsActions.loadStudentsFailure({
                  error: err.message || 'Unknown error',
                })
              )
            )
          )
        )
      );
    });

    // Create
    this.createStudent$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(StudentsActions.createStudent),
        concatMap(({ student }) =>
          this.studentsService.createStudent(student).pipe(
            map((newStudent) =>
              StudentsActions.createStudentSuccess({ student: newStudent })
            ),
            catchError((err) =>
              of(
                StudentsActions.createStudentFailure({
                  error: err.message || 'Unknown error',
                })
              )
            )
          )
        )
      );
    });

    // Update
    this.updateStudent$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(StudentsActions.updateStudent),
        mergeMap(({ student }) =>
          this.studentsService.updateStudent(student).pipe(
            map((updatedStudent) =>
              StudentsActions.updateStudentSuccess({ student: updatedStudent })
            ),
            catchError((err) =>
              of(
                StudentsActions.updateStudentFailure({
                  error: err.message || 'Unknown error',
                })
              )
            )
          )
        )
      );
    });

    // Delete
    this.deleteStudent$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(StudentsActions.deleteStudent),
        mergeMap(({ id }) =>
          this.studentsService.deleteStudent(id).pipe(
            map(() => StudentsActions.deleteStudentSuccess({ id })),
            catchError((err) =>
              of(
                StudentsActions.deleteStudentFailure({
                  error: err.message || 'Unknown error',
                })
              )
            )
          )
        )
      );
    });
  }
}
