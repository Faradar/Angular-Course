import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Course, Enrollment, Student } from '../../../../../../models';
import { StudentsService } from '../../students.service';
import { CoursesService } from '../../../courses/courses.service';
import { EnrollmentsService } from '../../../enrollments/enrollments.service';

@Component({
  selector: 'app-student-detail',
  standalone: false,
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss',
})
export class StudentDetailComponent implements OnInit {
  student$!: Observable<Student | null>;
  enrolledCourses: Course[] = [];
  private allEnrollments: Enrollment[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentsSvc: StudentsService,
    private coursesSvc: CoursesService,
    private enrollmentsSvc: EnrollmentsService
  ) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.student$ = this.studentsSvc.getStudentById(id);

    forkJoin({
      courses: this.coursesSvc.getCourses(),
      enrollments: this.enrollmentsSvc.getEnrollments(),
    }).subscribe(({ courses, enrollments }) => {
      this.allEnrollments = enrollments;
      const mine = enrollments.filter((e) => e.studentId === id);
      this.enrolledCourses = courses.filter((c) =>
        mine.some((e) => e.courseId === c.id)
      );
      this.loading = false;
    });
  }

  removeEnrollment(courseId: string): void {
    const id = this.route.snapshot.paramMap.get('id')!;

    const e = this.allEnrollments.find(
      (en) => en.studentId === id && en.courseId === courseId
    );
    if (!e) return;

    if (!confirm('Remove this enrollment?')) return;

    this.enrollmentsSvc.deleteEnrollment(e.id).subscribe(() => {
      this.ngOnInit();
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/students']);
  }
}
