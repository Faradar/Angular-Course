import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Enrollment } from '../../../../../models';

export const EnrollmentsActions = createActionGroup({
  source: 'Enrollments',
  events: {
    // Load
    'Load Enrollments': emptyProps(),
    'Load Enrollments Success': props<{ enrollments: Enrollment[] }>(),
    'Load Enrollments Failure': props<{ error: string }>(),

    // Create
    'Create Enrollment': props<{ enrollment: Omit<Enrollment, 'id'> }>(),
    'Create Enrollment Success': props<{ enrollment: Enrollment }>(),
    'Create Enrollment Failure': props<{ error: string }>(),

    // Update
    'Update Enrollment': props<{ enrollment: Enrollment }>(),
    'Update Enrollment Success': props<{ enrollment: Enrollment }>(),
    'Update Enrollment Failure': props<{ error: string }>(),

    // Delete
    'Delete Enrollment': props<{ id: string }>(),
    'Delete Enrollment Success': props<{ id: string }>(),
    'Delete Enrollment Failure': props<{ error: string }>(),
  },
});
