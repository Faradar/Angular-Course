import { Component, OnInit } from '@angular/core';
import { Course, Enrollment, Student } from '../../../../../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentsService } from '../../enrollments.service';
import { CoursesService } from '../../../courses/courses.service';
import { StudentsService } from '../../../students/students.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-enrollment-form',
  standalone: false,
  templateUrl: './enrollment-form.component.html',
  styleUrl: './enrollment-form.component.scss',
})
export class EnrollmentFormComponent implements OnInit {
  form!: FormGroup;
  editId: string | null = null;
  loading = false;

  students: Student[] = [];
  courses: Course[] = [];
  enrollments: Enrollment[] = [];

  notFound = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: EnrollmentsService,
    private coursesSvc: CoursesService,
    private studentsSvc: StudentsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      studentId: [null, Validators.required],
      courseId: [null, Validators.required],
      enrollmentDate: [new Date(), Validators.required],
    });

    this.loading = true;
    forkJoin({
      students: this.studentsSvc.getStudents(),
      courses: this.coursesSvc.getCourses(),
      enrollments: this.svc.getEnrollments(),
    }).subscribe(({ students, courses, enrollments }) => {
      this.students = students;
      this.courses = courses;
      this.enrollments = enrollments;
      this.loading = false;

      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.editId = idParam;
        this.svc.getEnrollmentById(idParam).subscribe((e) => {
          if (!e) {
            this.notFound = true;
            console.error('Enrollment not found');
            return;
          }
          this.form.patchValue({
            studentId: e.studentId,
            courseId: e.courseId,
            enrollmentDate: new Date(e.enrollmentDate),
          });
        });
      }
    });

    this.form.get('studentId')!.valueChanges.subscribe(() => {
      this.form.get('courseId')!.setValue(null);
    });
  }

  isCourseDisabled(courseId: string): boolean {
    const sid = this.form.get('studentId')?.value;
    if (!sid) return false;

    return this.enrollments.some(
      (e) => e.studentId === sid && e.courseId === courseId
    );
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: Enrollment = {
      ...this.form.value,
    } as Enrollment;
    const op$ = this.editId
      ? this.svc.updateEnrollment(payload)
      : this.svc.createEnrollment(payload);

    op$.subscribe(() => this.router.navigate(['/dashboard/enrollments']));
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/enrollments']);
  }
}
