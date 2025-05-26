import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEnrollmentsComponent } from './components/list-enrollments/list-enrollments.component';
import { EnrollmentFormComponent } from './components/enrollment-form/enrollment-form.component';
import { adminGuard } from '../../../../core/guards/admin.guard';

const routes: Routes = [
  { path: '', component: ListEnrollmentsComponent },
  {
    path: 'new',
    component: EnrollmentFormComponent,
  },
  {
    path: 'edit/:id',
    canActivate: [adminGuard],
    component: EnrollmentFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnrollmentsRoutingModule {}
