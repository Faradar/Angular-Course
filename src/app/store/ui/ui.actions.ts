import { createAction, props } from '@ngrx/store';

export const UIActions = {
  setToolbarTitle: createAction(
    '[UI] Set Toolbar Title',
    props<{ title: string }>()
  ),

  clearToolbarTitle: createAction('[UI] Clear Toolbar Title'),
};
