import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrollmentsRoutingModule } from './enrollments-routing.module';
import { EnrollmentFormComponent } from './components/enrollment-form/enrollment-form.component';
import { ListEnrollmentsComponent } from './components/list-enrollments/list-enrollments.component';
import { SharedModule } from '../../../../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { enrollmentsFeature } from './store/enrollments.reducer';
import { EnrollmentsEffects } from './store/enrollments.effects';

@NgModule({
  declarations: [EnrollmentFormComponent, ListEnrollmentsComponent],
  imports: [
    CommonModule,
    EnrollmentsRoutingModule,
    SharedModule,
    StoreModule.forFeature(enrollmentsFeature.name, enrollmentsFeature.reducer),
    EffectsModule.forFeature([EnrollmentsEffects]),
  ],
})
export class EnrollmentsModule {}
