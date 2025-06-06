import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { ListCoursesComponent } from './components/list-courses/list-courses.component';

import { SharedModule } from '../../../../shared/shared.module';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { CoursesDetailComponent } from './pages/courses-detail/courses-detail.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { coursesFeature } from './store/courses.reducer';
import { CoursesEffects } from './store/courses.effects';

@NgModule({
  declarations: [
    ListCoursesComponent,
    CourseFormComponent,
    CoursesDetailComponent,
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    StoreModule.forFeature(coursesFeature),
    EffectsModule.forFeature([CoursesEffects]),
  ],
})
export class CoursesModule {}
