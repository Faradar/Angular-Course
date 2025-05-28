import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { ListCoursesComponent } from './components/list-courses/list-courses.component';

import { SharedModule } from '../../../../shared/shared.module';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { CoursesDetailComponent } from './pages/courses-detail/courses-detail.component';

@NgModule({
  declarations: [
    ListCoursesComponent,
    CourseFormComponent,
    CoursesDetailComponent,
  ],
  imports: [CommonModule, CoursesRoutingModule, SharedModule],
})
export class CoursesModule {}
