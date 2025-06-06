import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // Login
    Login: props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: string }>(),

    // Token
    'Verify Token': emptyProps(),
    'Verify Token Success': props<{ user: User }>(),
    'Verify Token Failure': props<{ error: string }>(),

    // Logout
    Logout: emptyProps(),
  },
});
