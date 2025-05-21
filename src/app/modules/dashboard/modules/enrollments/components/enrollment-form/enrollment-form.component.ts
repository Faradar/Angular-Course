import { Component, OnInit } from '@angular/core';
import { Course, Enrollment, Student } from '../../../../../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentsService } from '../../enrollments.service';
import { CoursesService } from '../../../courses/courses.service';
import { StudentsService } from '../../../students/students.service';

@Component({
  selector: 'app-enrollment-form',
  standalone: false,
  templateUrl: './enrollment-form.component.html',
  styleUrl: './enrollment-form.component.scss',
})
export class EnrollmentFormComponent implements OnInit {
  form!: FormGroup;
  editId: number | null = null;
  loading = false;
  courses: Course[] = [];
  students: Student[] = [];
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

    // preload students & courses for <mat-select>
    this.coursesSvc.getCourses().subscribe((data) => (this.courses = data));
    this.studentsSvc.getStudents().subscribe((data) => (this.students = data));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      this.loadEnrollment(this.editId);
    }
  }

  private loadEnrollment(id: number) {
    this.loading = true;
    this.svc.getEnrollments().subscribe({
      next: (list) => {
        const e = list.find((x) => x.id === id);
        if (e) {
          this.form.patchValue({
            studentId: e.studentId,
            courseId: e.courseId,
            enrollmentDate: new Date(e.enrollmentDate),
          });
        } else {
          this.notFound = true;
        }
        this.loading = false;
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Enrollment = {
      ...this.form.value,
      id: this.editId || 0,
    };

    if (this.editId) {
      payload.id = this.editId;
      this.svc
        .updateEnrollment(payload)
        .subscribe(() => this.router.navigate(['/dashboard/enrollments']));
    } else {
      this.svc
        .createEnrollment(payload)
        .subscribe(() => this.router.navigate(['/dashboard/enrollments']));
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/enrollments']);
  }
}
