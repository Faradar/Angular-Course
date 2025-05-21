import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { ListCoursesComponent } from './components/list-courses/list-courses.component';

import { SharedModule } from '../../../../shared/shared.module';
import { CourseFormComponent } from './components/course-form/course-form.component';

@NgModule({
  declarations: [ListCoursesComponent, CourseFormComponent],
  imports: [CommonModule, CoursesRoutingModule, SharedModule],
})
export class CoursesModule {}
