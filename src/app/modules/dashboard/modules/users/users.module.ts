import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../../../../shared/shared.module';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { usersFeature } from './store/users.reducer';
import { UsersEffects } from './store/users.effects';

@NgModule({
  declarations: [ListUsersComponent, UserFormComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    StoreModule.forFeature(usersFeature),
    EffectsModule.forFeature([UsersEffects]),
  ],
})
export class UsersModule {}
