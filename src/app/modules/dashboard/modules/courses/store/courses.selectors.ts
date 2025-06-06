import { createFeatureSelector, createSelector } from '@ngrx/store';
import { COURSES_FEATURE_KEY, CoursesState } from './courses.reducer';

export const selectCoursesState =
  createFeatureSelector<CoursesState>(COURSES_FEATURE_KEY);

export const selectAllCourses = createSelector(
  selectCoursesState,
  (state) => state.list
);
export const selectCoursesLoading = createSelector(
  selectCoursesState,
  (state) => state.loading
);

export const selectCoursesError = createSelector(
  selectCoursesState,
  (state) => state.error
);
