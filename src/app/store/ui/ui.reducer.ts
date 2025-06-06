import { createReducer, on } from '@ngrx/store';
import { UIActions } from './ui.actions';

export interface UIState {
  toolbarTitle: string;
}

export const uiInitialState: UIState = {
  toolbarTitle: '',
};

export const uiFeatureKey = 'ui';

export const uiReducer = createReducer(
  uiInitialState,

  on(UIActions.setToolbarTitle, (state, { title }) => ({
    ...state,
    toolbarTitle: title,
  })),

  on(UIActions.clearToolbarTitle, (state) => ({
    ...state,
    toolbarTitle: '',
  }))
);
