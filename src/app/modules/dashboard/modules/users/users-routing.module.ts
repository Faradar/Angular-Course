import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from '../../../../core/guards/admin.guard';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { UserFormComponent } from './components/user-form/user-form.component';

const routes: Routes = [
  { path: '', canActivate: [adminGuard], component: ListUsersComponent },
  { path: 'new', canActivate: [adminGuard], component: UserFormComponent },
  { path: 'edit/:id', canActivate: [adminGuard], component: UserFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
