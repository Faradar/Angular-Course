import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../../../../models';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    // Load
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),

    // Create
    'Create User': props<{ user: Omit<User, 'id'> }>(),
    'Create User Success': props<{ user: User }>(),
    'Create User Failure': props<{ error: string }>(),

    // Update
    'Update User': props<{ user: User }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: string }>(),

    // Delete
    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ id: string }>(),
    'Delete User Failure': props<{ error: string }>(),
  },
});
