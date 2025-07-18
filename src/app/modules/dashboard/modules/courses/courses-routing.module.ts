import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCoursesComponent } from './components/list-courses/list-courses.component';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { adminGuard } from '../../../../core/guards/admin.guard';
import { CoursesDetailComponent } from './pages/courses-detail/courses-detail.component';

const routes: Routes = [
  { path: '', component: ListCoursesComponent },
  { path: 'new', canActivate: [adminGuard], component: CourseFormComponent },
  {
    path: 'edit/:id',
    canActivate: [adminGuard],
    component: CourseFormComponent,
  },
  {
    path: ':id',
    component: CoursesDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
