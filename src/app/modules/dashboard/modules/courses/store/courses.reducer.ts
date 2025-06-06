import { createFeature, createReducer, on } from '@ngrx/store';
import { CoursesActions } from './courses.actions';
import { Course } from '../../../../../models';

export const COURSES_FEATURE_KEY = 'courses';

export interface CoursesState {
  list: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  list: [],
  loading: false,
  error: null,
};

const coursesReducerInternal = createReducer(
  initialState,

  // Load all courses
  on(CoursesActions.loadCourses, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CoursesActions.loadCoursesSuccess, (state, { courses }) => ({
    ...state,
    list: courses,
    loading: false,
    error: null,
  })),
  on(CoursesActions.loadCoursesFailure, (state, { error }) => ({
    ...state,
    list: [],
    loading: false,
    error,
  })),

  // Create a course
  on(CoursesActions.createCourse, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CoursesActions.createCourseSuccess, (state, { course }) => ({
    ...state,
    list: [...state.list, course],
    loading: false,
    error: null,
  })),
  on(CoursesActions.createCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update a course
  on(CoursesActions.updateCourse, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CoursesActions.updateCourseSuccess, (state, { course }) => ({
    ...state,
    list: state.list.map((c) => (c.id === course.id ? course : c)),
    loading: false,
    error: null,
  })),
  on(CoursesActions.updateCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete a course
  on(CoursesActions.deleteCourse, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CoursesActions.deleteCourseSuccess, (state, { id }) => ({
    ...state,
    list: state.list.filter((c) => c.id !== id),
    loading: false,
    error: null,
  })),
  on(CoursesActions.deleteCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const coursesFeature = createFeature({
  name: COURSES_FEATURE_KEY,
  reducer: coursesReducerInternal,
});
