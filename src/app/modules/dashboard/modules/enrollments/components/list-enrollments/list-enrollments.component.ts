import { Component, OnInit } from '@angular/core';
import { Course, Enrollment, Student, User } from '../../../../../../models';
import { Router } from '@angular/router';
import { StudentsService } from '../../../students/students.service';
import { CoursesService } from '../../../courses/courses.service';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { UIActions } from '../../../../../../store/ui/ui.actions';
import {
  selectAllEnrollments,
  selectEnrollmentsError,
  selectEnrollmentsLoading,
} from '../../store/enrollments.selectors';
import { EnrollmentsActions } from '../../store/enrollments.actions';
import { selectAuthUser } from '../../../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-list-enrollments',
  standalone: false,
  templateUrl: './list-enrollments.component.html',
  styleUrl: './list-enrollments.component.scss',
})
export class ListEnrollmentsComponent implements OnInit {
  enrollments$: Observable<Enrollment[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  authUser$: Observable<User | null>;

  studentsMap = new Map<string, Student>();
  coursesMap = new Map<string, Course>();

  displayedColumns = [
    'id',
    'studentName',
    'courseName',
    'enrollmentDate',
    'actions',
  ];

  fallbackStudent: Student = {
    id: '0',
    firstName: 'Unknown',
    lastName: 'Student',
    email: '',
  };

  constructor(
    private store: Store,
    private studentsSvc: StudentsService,
    private coursesSvc: CoursesService,
    private router: Router
  ) {
    this.enrollments$ = this.store.pipe(select(selectAllEnrollments));
    this.loading$ = this.store.pipe(select(selectEnrollmentsLoading));
    this.error$ = this.store.pipe(select(selectEnrollmentsError));
    this.authUser$ = this.store.pipe(select(selectAuthUser));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UIActions.setToolbarTitle({ title: 'Enrollments' }));
    }, 0);

    this.store.dispatch(EnrollmentsActions.loadEnrollments());

    this.studentsSvc.getStudents().subscribe((list) => {
      list.forEach((s) => this.studentsMap.set(s.id, s));
    });

    this.coursesSvc.getCourses().subscribe((list) => {
      list.forEach((c) => this.coursesMap.set(c.id, c));
    });
  }

  onNew(): void {
    this.router.navigate(['/dashboard/enrollments/new']);
  }

  onEdit(enrollment: Enrollment): void {
    this.router.navigate(['/dashboard/enrollments/edit', enrollment.id]);
  }

  onDelete(id: string): void {
    if (!confirm('Delete this enrollment?')) {
      return;
    }
    this.store.dispatch(EnrollmentsActions.deleteEnrollment({ id }));
  }
}
