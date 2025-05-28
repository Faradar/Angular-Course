import { Component, OnInit } from '@angular/core';
import { Course, Enrollment, Student } from '../../../../../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../courses.service';
import { StudentsService } from '../../../students/students.service';
import { EnrollmentsService } from '../../../enrollments/enrollments.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-courses-detail',
  standalone: false,
  templateUrl: './courses-detail.component.html',
  styleUrl: './courses-detail.component.scss',
})
export class CoursesDetailComponent implements OnInit {
  course: Course | null = null;
  enrolledStudents: Student[] = [];
  private allEnrollments: Enrollment[] = [];
  loading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesSvc: CoursesService,
    private studentsSvc: StudentsService,
    private enrollmentsSvc: EnrollmentsService
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id')!;
    // load all three sets at once
    forkJoin({
      courses: this.coursesSvc.getCourses(),
      students: this.studentsSvc.getStudents(),
      enrollments: this.enrollmentsSvc.getEnrollments(),
    }).subscribe(({ courses, students, enrollments }) => {
      this.allEnrollments = enrollments;
      // find the requested course
      const found = courses.find((c) => c.id === courseId);
      if (!found) {
        this.notFound = true;
        this.loading = false;
        return;
      }
      this.course = found;

      // get enrollments for this course
      const mine = enrollments.filter((e) => e.courseId === courseId);
      // map those to Student objects
      this.enrolledStudents = students.filter((s) =>
        mine.some((e) => e.studentId === s.id)
      );
      this.loading = false;
    });
  }

  removeStudent(studentId: string): void {
    if (!confirm('Unenroll this student?')) return;

    const courseId = this.route.snapshot.paramMap.get('id')!;
    const enrollment = this.allEnrollments.find(
      (e) => e.courseId === courseId && e.studentId === studentId
    );
    if (!enrollment) return;

    this.enrollmentsSvc.deleteEnrollment(enrollment.id).subscribe(() => {
      // reload after deletion
      this.ngOnInit();
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/courses']);
  }
}
