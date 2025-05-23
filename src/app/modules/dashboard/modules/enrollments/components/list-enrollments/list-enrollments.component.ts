import { Component, OnInit } from '@angular/core';
import { Course, Enrollment, Student, User } from '../../../../../../models';
import { EnrollmentsService } from '../../enrollments.service';
import { Router } from '@angular/router';
import { StudentsService } from '../../../students/students.service';
import { CoursesService } from '../../../courses/courses.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../../../core/services/auth.service';

@Component({
  selector: 'app-list-enrollments',
  standalone: false,
  templateUrl: './list-enrollments.component.html',
  styleUrl: './list-enrollments.component.scss',
})
export class ListEnrollmentsComponent implements OnInit {
  enrollments: Enrollment[] = [];
  studentsMap = new Map<string, Student>();
  coursesMap = new Map<string, Course>();
  loading = false;
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

  authUser$: Observable<User | null>;

  constructor(
    private svc: EnrollmentsService,
    private studentsSvc: StudentsService,
    private coursesSvc: CoursesService,
    private router: Router,
    private authService: AuthService
  ) {
    this.authUser$ = this.authService.authUser$;
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
    this.fetch();
  }

  private loadStudents(): void {
    this.studentsSvc.getStudents().subscribe((list) => {
      list.forEach((s) => this.studentsMap.set(s.id, s));
    });
  }

  private loadCourses(): void {
    this.coursesSvc.getCourses().subscribe((list) => {
      list.forEach((c) => this.coursesMap.set(c.id, c));
    });
  }

  private fetch(): void {
    this.loading = true;
    this.svc.getEnrollments().subscribe({
      next: (data) => {
        this.enrollments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading enrollments', err);
        this.loading = false;
      },
    });
  }

  onNew(): void {
    this.router.navigate(['/dashboard/enrollments/new']);
  }

  onEdit(e: Enrollment): void {
    this.router.navigate(['dashboard', 'enrollments', 'edit', e.id]);
  }

  onDelete(id: string): void {
    if (!confirm('Delete this enrollment?')) return;
    this.svc.deleteEnrollment(id).subscribe({
      next: () => this.fetch(),
      error: (err) => console.error('Delete failed', err),
    });
  }
}
