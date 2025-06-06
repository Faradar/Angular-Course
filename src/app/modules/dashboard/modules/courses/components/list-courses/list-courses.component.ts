import { Component, OnInit } from '@angular/core';
import { Course, User } from '../../../../../../models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../../../core/services/auth.service';
import { select, Store } from '@ngrx/store';
import { UIActions } from '../../../../../../store/ui/ui.actions';
import {
  selectAllCourses,
  selectCoursesError,
  selectCoursesLoading,
} from '../../store/courses.selectors';
import { selectAuthUser } from '../../../../../../store/auth/auth.selectors';
import { CoursesActions } from '../../store/courses.actions';

@Component({
  selector: 'app-list-courses',
  standalone: false,
  templateUrl: './list-courses.component.html',
  styleUrl: './list-courses.component.scss',
})
export class ListCoursesComponent implements OnInit {
  courses$: Observable<Course[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'duration',
    'actions',
  ];

  authUser$: Observable<User | null>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store
  ) {
    this.courses$ = this.store.pipe(select(selectAllCourses));
    this.loading$ = this.store.pipe(select(selectCoursesLoading));
    this.error$ = this.store.pipe(select(selectCoursesError));
    this.authUser$ = this.store.pipe(select(selectAuthUser));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UIActions.setToolbarTitle({ title: 'Courses' }));
    }, 0);

    this.store.dispatch(CoursesActions.loadCourses());
  }

  onNew(): void {
    this.router.navigate(['/dashboard/courses/new']);
  }

  onEdit(course: Course): void {
    this.router.navigate(['dashboard', 'courses', 'edit', course.id]);
  }

  onDelete(id: string): void {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }
    this.store.dispatch(CoursesActions.deleteCourse({ id }));
  }
}
