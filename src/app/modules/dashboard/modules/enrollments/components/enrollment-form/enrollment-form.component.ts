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
  editId: number | null = null;
  loading = false;

  students: Student[] = [];
  courses: Course[] = [];
  enrollments: Enrollment[] = [];

  notFound = false;

  /** remember the original course in edit mode **/
  private originalCourseId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: EnrollmentsService,
    private coursesSvc: CoursesService,
    private studentsSvc: StudentsService
  ) {}

  ngOnInit(): void {
    // 1) build the form
    this.form = this.fb.group({
      studentId: [null, Validators.required],
      courseId: [null, Validators.required],
      enrollmentDate: [new Date(), Validators.required],
    });

    // 2) load students, courses & enrollments in parallel
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

      // 3) if we're editing, patch the form and capture originalCourseId
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.editId = +idParam;
        const e = enrollments.find((x) => x.id === this.editId);
        if (!e) {
          this.notFound = true;
          return;
        }
        this.originalCourseId = e.courseId;
        this.form.patchValue({
          studentId: e.studentId,
          courseId: e.courseId,
          enrollmentDate: new Date(e.enrollmentDate),
        });
      }
    });

    // 4) whenever the student changes, clear out the old course selection
    this.form.get('studentId')!.valueChanges.subscribe(() => {
      this.form.get('courseId')!.setValue(null);
    });
  }

  /**
   * Disable any course the current student is already enrolled in,
   * except the originalCourseId when in edit mode.
   */
  isCourseDisabled(courseId: number): boolean {
    const sid = this.form.get('studentId')?.value;
    if (!sid) return false;

    // otherwise disable if an enrollment exists for this student+course
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
      id: this.editId || 0,
    };

    const op$ = this.editId
      ? this.svc.updateEnrollment(payload)
      : this.svc.createEnrollment(payload);

    op$.subscribe(() => this.router.navigate(['/dashboard/enrollments']));
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/enrollments']);
  }
}
