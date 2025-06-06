import { createFeature, createReducer, on } from '@ngrx/store';
import { StudentsActions } from './students.actions';
import { Student } from '../../../../../models';

export const STUDENTS_FEATURE_KEY = 'students';

export interface StudentsState {
  list: Student[];
  loading: boolean;
  error: string | null;
}

export const initialState: StudentsState = {
  list: [],
  loading: false,
  error: null,
};

export const studentsReducer = createReducer(
  initialState,

  // Load
  on(StudentsActions.loadStudents, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(StudentsActions.loadStudentsSuccess, (state, { students }) => ({
    ...state,
    list: students,
    loading: false,
    error: null,
  })),
  on(StudentsActions.loadStudentsFailure, (state, { error }) => ({
    ...state,
    list: [],
    loading: false,
    error,
  })),

  // Create
  on(StudentsActions.createStudent, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(StudentsActions.createStudentSuccess, (state, { student }) => ({
    ...state,
    list: [...state.list, student],
    loading: false,
    error: null,
  })),
  on(StudentsActions.createStudentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update
  on(StudentsActions.updateStudent, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(StudentsActions.updateStudentSuccess, (state, { student }) => ({
    ...state,
    list: state.list.map((s) => (s.id === student.id ? student : s)),
    loading: false,
    error: null,
  })),
  on(StudentsActions.updateStudentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete
  on(StudentsActions.deleteStudent, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(StudentsActions.deleteStudentSuccess, (state, { id }) => ({
    ...state,
    list: state.list.filter((s) => s.id !== id),
    loading: false,
    error: null,
  })),
  on(StudentsActions.deleteStudentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const studentsFeature = createFeature({
  name: STUDENTS_FEATURE_KEY,
  reducer: studentsReducer,
});
