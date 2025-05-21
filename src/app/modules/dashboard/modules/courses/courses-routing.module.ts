import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCoursesComponent } from './components/list-courses/list-courses.component';
import { CourseFormComponent } from './components/course-form/course-form.component';

const routes: Routes = [
  { path: '', component: ListCoursesComponent },
  { path: 'new', component: CourseFormComponent },
  { path: 'edit/:id', component: CourseFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
