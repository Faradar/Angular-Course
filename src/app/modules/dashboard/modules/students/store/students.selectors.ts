import { createFeatureSelector, createSelector } from '@ngrx/store';
import { STUDENTS_FEATURE_KEY, StudentsState } from './students.reducer';

export const selectStudentsState =
  createFeatureSelector<StudentsState>(STUDENTS_FEATURE_KEY);

export const selectAllStudents = createSelector(
  selectStudentsState,
  (state) => state.list
);

export const selectStudentsLoading = createSelector(
  selectStudentsState,
  (state) => state.loading
);

export const selectStudentsError = createSelector(
  selectStudentsState,
  (state) => state.error
);
