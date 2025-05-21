import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEnrollmentsComponent } from './components/list-enrollments/list-enrollments.component';
import { EnrollmentFormComponent } from './components/enrollment-form/enrollment-form.component';

const routes: Routes = [
  { path: '', component: ListEnrollmentsComponent },
  { path: 'new', component: EnrollmentFormComponent },
  { path: 'edit/:id', component: EnrollmentFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnrollmentsRoutingModule {}
