import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, map, Observable, take } from 'rxjs';
import { Course, Enrollment, Student } from '../../../../../../models';
import { select, Store } from '@ngrx/store';
import { StudentsActions } from '../../store/students.actions';
import { CoursesActions } from '../../../courses/store/courses.actions';
import { EnrollmentsActions } from '../../../enrollments/store/enrollments.actions';
import { selectAllStudents } from '../../store/students.selectors';
import { selectAllEnrollments } from '../../../enrollments/store/enrollments.selectors';
import { selectAllCourses } from '../../../courses/store/courses.selectors';

@Component({
  selector: 'app-student-detail',
  standalone: false,
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss',
})
export class StudentDetailComponent implements OnInit {
  private studentId!: string;

  student$!: Observable<Student | null>;
  enrolledCourses$!: Observable<Course[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id')!;

    this.store.dispatch(StudentsActions.loadStudents());
    this.store.dispatch(CoursesActions.loadCourses());
    this.store.dispatch(EnrollmentsActions.loadEnrollments());

    this.student$ = this.store.pipe(
      select(selectAllStudents),
      map((list) => list.find((s) => s.id === this.studentId) || null)
    );

    this.enrolledCourses$ = combineLatest([
      this.store.pipe(select(selectAllEnrollments)),
      this.store.pipe(select(selectAllCourses)),
    ]).pipe(
      map(([enrollments, courses]) => {
        const myEnrollments: Enrollment[] = enrollments.filter(
          (e) => e.studentId === this.studentId
        );
        return courses.filter((c) =>
          myEnrollments.some((me) => me.courseId === c.id)
        );
      })
    );
  }

  removeEnrollment(courseId: string): void {
    this.store
      .pipe(
        select(selectAllEnrollments),
        take(1),
        map(
          (enrollments) =>
            enrollments.find(
              (en) =>
                en.studentId === this.studentId && en.courseId === courseId
            ) || null
        ),
        filter((found): found is Enrollment => found !== null)
      )
      .subscribe((foundEnrollment) => {
        if (!confirm('Remove this enrollment?')) {
          return;
        }

        this.store.dispatch(
          EnrollmentsActions.deleteEnrollment({ id: foundEnrollment.id })
        );
      });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/students']);
  }
}
