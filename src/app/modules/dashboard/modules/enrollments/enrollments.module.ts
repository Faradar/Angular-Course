import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrollmentsRoutingModule } from './enrollments-routing.module';
import { EnrollmentFormComponent } from './components/enrollment-form/enrollment-form.component';
import { ListEnrollmentsComponent } from './components/list-enrollments/list-enrollments.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [EnrollmentFormComponent, ListEnrollmentsComponent],
  imports: [CommonModule, EnrollmentsRoutingModule, SharedModule],
})
export class EnrollmentsModule {}
