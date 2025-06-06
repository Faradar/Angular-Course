import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ENROLLMENTS_FEATURE_KEY,
  EnrollmentsState,
} from './enrollments.reducer';

export const selectEnrollmentsState = createFeatureSelector<EnrollmentsState>(
  ENROLLMENTS_FEATURE_KEY
);

export const selectAllEnrollments = createSelector(
  selectEnrollmentsState,
  (state) => state.list
);

export const selectEnrollmentsLoading = createSelector(
  selectEnrollmentsState,
  (state) => state.loading
);

export const selectEnrollmentsError = createSelector(
  selectEnrollmentsState,
  (state) => state.error
);
