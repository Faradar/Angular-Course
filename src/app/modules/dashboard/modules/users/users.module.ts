import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../../../../shared/shared.module';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { UserFormComponent } from './components/user-form/user-form.component';

@NgModule({
  declarations: [
    ListUsersComponent,
    UserFormComponent
  ],
  imports: [CommonModule, UsersRoutingModule, SharedModule],
})
export class UsersModule {}
