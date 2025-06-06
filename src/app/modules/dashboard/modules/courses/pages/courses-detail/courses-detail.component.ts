import { Component, OnInit } from '@angular/core';
import { Course, Enrollment, Student } from '../../../../../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, map, Observable, take } from 'rxjs';
import { CoursesActions } from '../../store/courses.actions';
import { StudentsActions } from '../../../students/store/students.actions';
import { EnrollmentsActions } from '../../../enrollments/store/enrollments.actions';
import { select, Store } from '@ngrx/store';
import { selectAllCourses } from '../../store/courses.selectors';
import { selectAllEnrollments } from '../../../enrollments/store/enrollments.selectors';
import { selectAllStudents } from '../../../students/store/students.selectors';

@Component({
  selector: 'app-courses-detail',
  standalone: false,
  templateUrl: './courses-detail.component.html',
  styleUrl: './courses-detail.component.scss',
})
export class CoursesDetailComponent implements OnInit {
  private courseId!: string;

  course$!: Observable<Course | null>;
  enrolledStudents$!: Observable<Student[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id')!;

    this.store.dispatch(CoursesActions.loadCourses());
    this.store.dispatch(StudentsActions.loadStudents());
    this.store.dispatch(EnrollmentsActions.loadEnrollments());

    this.course$ = this.store.pipe(
      select(selectAllCourses),
      map((list) => list.find((c) => c.id === this.courseId) || null)
    );

    this.enrolledStudents$ = combineLatest([
      this.store.pipe(select(selectAllEnrollments)),
      this.store.pipe(select(selectAllStudents)),
    ]).pipe(
      map(([enrollments, students]) => {
        const myEnrollments: Enrollment[] = enrollments.filter(
          (en) => en.courseId === this.courseId
        );
        return students.filter((stu) =>
          myEnrollments.some((me) => me.studentId === stu.id)
        );
      })
    );
  }

  removeStudent(studentId: string): void {
    this.store
      .pipe(
        select(selectAllEnrollments),
        take(1),
        map(
          (enrollments) =>
            enrollments.find(
              (e) => e.courseId === this.courseId && e.studentId === studentId
            ) || null
        ),
        filter((found): found is Enrollment => found !== null)
      )
      .subscribe((foundEnrollment) => {
        if (!confirm('Unenroll this student?')) return;
        this.store.dispatch(
          EnrollmentsActions.deleteEnrollment({ id: foundEnrollment.id })
        );
      });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/courses']);
  }
}
