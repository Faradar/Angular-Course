import { createFeature, createReducer, on } from '@ngrx/store';
import { EnrollmentsActions } from './enrollments.actions';
import { Enrollment } from '../../../../../models';

export const ENROLLMENTS_FEATURE_KEY = 'enrollments';

export interface EnrollmentsState {
  list: Enrollment[];
  loading: boolean;
  error: string | null;
}

export const initialEnrollmentsState: EnrollmentsState = {
  list: [],
  loading: false,
  error: null,
};

const enrollmentsReducerInternal = createReducer(
  initialEnrollmentsState,

  // Load
  on(EnrollmentsActions.loadEnrollments, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(EnrollmentsActions.loadEnrollmentsSuccess, (state, { enrollments }) => ({
    ...state,
    list: enrollments,
    loading: false,
    error: null,
  })),
  on(EnrollmentsActions.loadEnrollmentsFailure, (state, { error }) => ({
    ...state,
    list: [],
    loading: false,
    error,
  })),

  // Create
  on(EnrollmentsActions.createEnrollment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(EnrollmentsActions.createEnrollmentSuccess, (state, { enrollment }) => ({
    ...state,
    list: [...state.list, enrollment],
    loading: false,
    error: null,
  })),
  on(EnrollmentsActions.createEnrollmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update
  on(EnrollmentsActions.updateEnrollment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(EnrollmentsActions.updateEnrollmentSuccess, (state, { enrollment }) => ({
    ...state,
    list: state.list.map((e) => (e.id === enrollment.id ? enrollment : e)),
    loading: false,
    error: null,
  })),
  on(EnrollmentsActions.updateEnrollmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete
  on(EnrollmentsActions.deleteEnrollment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(EnrollmentsActions.deleteEnrollmentSuccess, (state, { id }) => ({
    ...state,
    list: state.list.filter((e) => e.id !== id),
    loading: false,
    error: null,
  })),
  on(EnrollmentsActions.deleteEnrollmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const enrollmentsFeature = createFeature({
  name: ENROLLMENTS_FEATURE_KEY,
  reducer: enrollmentsReducerInternal,
});
