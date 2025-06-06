import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { User } from '../../models';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const authInitialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const authFeatureKey = 'auth';

export const authReducer = createReducer(
  authInitialState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Login Success
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    token: user.token,
    loading: false,
    error: null,
  })),

  // Login Failure
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    loading: false,
    error,
  })),

  // Verify Token → same as login
  on(AuthActions.verifyToken, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Verify Token Success → same as loginSuccess
  on(AuthActions.verifyTokenSuccess, (state, { user }) => ({
    ...state,
    user,
    token: user.token,
    loading: false,
    error: null,
  })),

  // Verify Token Failure → same as loginFailure
  on(AuthActions.verifyTokenFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    loading: false,
    error,
  })),

  // Logout
  on(AuthActions.logout, () => ({
    ...authInitialState,
  }))
);
