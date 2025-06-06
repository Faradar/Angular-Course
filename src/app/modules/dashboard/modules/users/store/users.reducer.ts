import { createFeature, createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';
import { User } from '../../../../../models';

export const USERS_FEATURE_KEY = 'users';

export interface UsersState {
  list: User[];
  loading: boolean;
  error: string | null;
}

export const initialUsersState: UsersState = {
  list: [],
  loading: false,
  error: null,
};

const usersReducerInternal = createReducer(
  initialUsersState,

  // Load
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    list: users,
    loading: false,
    error: null,
  })),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    list: [],
    loading: false,
    error,
  })),

  // Create
  on(UsersActions.createUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.createUserSuccess, (state, { user }) => ({
    ...state,
    list: [...state.list, user],
    loading: false,
    error: null,
  })),
  on(UsersActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update
  on(UsersActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    list: state.list.map((u) => (u.id === user.id ? user : u)),
    loading: false,
    error: null,
  })),
  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete
  on(UsersActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    list: state.list.filter((u) => u.id !== id),
    loading: false,
    error: null,
  })),
  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const usersFeature = createFeature({
  name: USERS_FEATURE_KEY,
  reducer: usersReducerInternal,
});
