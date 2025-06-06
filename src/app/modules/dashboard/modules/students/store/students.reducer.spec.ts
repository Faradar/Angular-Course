import { StudentsActions } from './students.actions';
import {
  studentsReducer,
  StudentsState,
  initialState,
} from './students.reducer';
import { Student } from '../../../../../models';

describe('Students Reducer', () => {
  let defaultState: StudentsState;

  beforeEach(() => {
    defaultState = {
      list: [],
      loading: false,
      error: null,
    };
  });

  it('should return the default initial state when an unknown action is dispatched', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const result = studentsReducer(undefined, unknownAction);
    expect(result).toEqual(initialState);
  });

  it('should set loading=true on loadStudents action', () => {
    const action = StudentsActions.loadStudents();
    const result = studentsReducer(defaultState, action);
    expect(result).toEqual({
      ...defaultState,
      loading: true,
      error: null,
    });
  });

  it('should populate list and set loading=false on loadStudentsSuccess', () => {
    const mockStudents: Student[] = [
      {
        id: 'a1',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
      },
      {
        id: 'b2',
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'bob@example.com',
      },
    ];
    const action = StudentsActions.loadStudentsSuccess({
      students: mockStudents,
    });
    const stateBefore: StudentsState = { list: [], loading: true, error: null };
    const result = studentsReducer(stateBefore, action);

    expect(result.list).toEqual(mockStudents);
    expect(result.loading).toBeFalse();
    expect(result.error).toBeNull();
  });

  it('should set error and loading=false on loadStudentsFailure', () => {
    const errorMsg = 'Failed to load';
    const action = StudentsActions.loadStudentsFailure({ error: errorMsg });
    const stateBefore: StudentsState = { list: [], loading: true, error: null };
    const result = studentsReducer(stateBefore, action);

    expect(result.error).toEqual(errorMsg);
    expect(result.loading).toBeFalse();
    expect(result.list).toEqual([]);
  });

  it('should add a student to list on createStudentSuccess', () => {
    const existing: Student[] = [
      {
        id: 'x1',
        firstName: 'Existing',
        lastName: 'User',
        email: 'ex@example.com',
      },
    ];
    const newStudent: Student = {
      id: 'y2',
      firstName: 'New',
      lastName: 'User',
      email: 'new@example.com',
    };
    const action = StudentsActions.createStudentSuccess({
      student: newStudent,
    });
    const stateBefore: StudentsState = {
      list: existing,
      loading: false,
      error: null,
    };
    const result = studentsReducer(stateBefore, action);

    expect(result.list.length).toBe(2);
    expect(result.list).toContain(newStudent);
    expect(result.loading).toBeFalse();
    expect(result.error).toBeNull();
  });

  it('should replace a student on updateStudentSuccess', () => {
    const original: Student = {
      id: 'z3',
      firstName: 'Zed',
      lastName: 'Original',
      email: 'zed@example.com',
    };
    const updated: Student = {
      id: 'z3',
      firstName: 'Zed',
      lastName: 'Updated',
      email: 'zed-updated@example.com',
    };
    const action = StudentsActions.updateStudentSuccess({ student: updated });
    const stateBefore: StudentsState = {
      list: [original],
      loading: false,
      error: null,
    };
    const result = studentsReducer(stateBefore, action);

    expect(result.list.length).toBe(1);
    expect(result.list[0]).toEqual(updated);
    expect(result.loading).toBeFalse();
    expect(result.error).toBeNull();
  });

  it('should remove a student on deleteStudentSuccess', () => {
    const toRemove: Student = {
      id: 'r4',
      firstName: 'Remove',
      lastName: 'Me',
      email: 'remove@example.com',
    };
    const keep: Student = {
      id: 'k5',
      firstName: 'Keep',
      lastName: 'Me',
      email: 'keep@example.com',
    };
    const action = StudentsActions.deleteStudentSuccess({ id: toRemove.id });
    const stateBefore: StudentsState = {
      list: [toRemove, keep],
      loading: false,
      error: null,
    };
    const result = studentsReducer(stateBefore, action);

    expect(result.list.length).toBe(1);
    expect(result.list[0]).toEqual(keep);
    expect(result.loading).toBeFalse();
    expect(result.error).toBeNull();
  });

  it('should set error on createStudentFailure, updateStudentFailure, or deleteStudentFailure', () => {
    const errorMsg = 'Network error';
    const failureActions = [
      StudentsActions.createStudentFailure({ error: errorMsg }),
      StudentsActions.updateStudentFailure({ error: errorMsg }),
      StudentsActions.deleteStudentFailure({ error: errorMsg }),
    ];

    failureActions.forEach((action) => {
      const result = studentsReducer(defaultState, action);
      expect(result.error).toEqual(errorMsg);
      expect(result.loading).toBeFalse();
    });
  });
});
