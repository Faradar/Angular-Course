import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Student } from '../../../../../models';

export const StudentsActions = createActionGroup({
  source: 'Students',
  events: {
    // Load
    'Load Students': emptyProps(),
    'Load Students Success': props<{ students: Student[] }>(),
    'Load Students Failure': props<{ error: string }>(),

    // Create
    'Create Student': props<{ student: Omit<Student, 'id'> }>(),
    'Create Student Success': props<{ student: Student }>(),
    'Create Student Failure': props<{ error: string }>(),

    // Update
    'Update Student': props<{ student: Student }>(),
    'Update Student Success': props<{ student: Student }>(),
    'Update Student Failure': props<{ error: string }>(),

    // Delete
    'Delete Student': props<{ id: string }>(),
    'Delete Student Success': props<{ id: string }>(),
    'Delete Student Failure': props<{ error: string }>(),
  },
});
