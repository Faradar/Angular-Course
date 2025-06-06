import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UIState, uiFeatureKey } from './ui.reducer';

export const selectUIState = createFeatureSelector<UIState>(uiFeatureKey);

export const selectToolbarTitle = createSelector(
  selectUIState,
  (state: UIState) => state.toolbarTitle
);
