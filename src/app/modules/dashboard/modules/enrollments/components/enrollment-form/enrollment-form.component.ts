import { Component, OnInit } from '@angular/core';
import { Course, Enrollment, Student } from '../../../../../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../courses/courses.service';
import { StudentsService } from '../../../students/students.service';
import { forkJoin, Observable, take } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { UIActions } from '../../../../../../store/ui/ui.actions';
import {
  selectAllEnrollments,
  selectEnrollmentsError,
  selectEnrollmentsLoading,
} from '../../store/enrollments.selectors';
import { EnrollmentsActions } from '../../store/enrollments.actions';

@Component({
  selector: 'app-enrollment-form',
  standalone: false,
  templateUrl: './enrollment-form.component.html',
  styleUrl: './enrollment-form.component.scss',
})
export class EnrollmentFormComponent implements OnInit {
  form!: FormGroup;
  editId: string | null = null;

  students: Student[] = [];
  courses: Course[] = [];
  allEnrollments: Enrollment[] = [];

  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  notFound = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private studentsSvc: StudentsService,
    private coursesSvc: CoursesService
  ) {
    this.loading$ = this.store.pipe(select(selectEnrollmentsLoading));
    this.error$ = this.store.pipe(select(selectEnrollmentsError));
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const isEdit = !!this.route.snapshot.paramMap.get('id');
    const title = isEdit ? 'Edit Enrollment' : 'New Enrollment';
    setTimeout(() => {
      this.store.dispatch(UIActions.setToolbarTitle({ title }));
    }, 0);

    this.form = this.fb.group({
      studentId: [null, Validators.required],
      courseId: [null, Validators.required],
      enrollmentDate: [new Date(), Validators.required],
    });

    this.store.dispatch(EnrollmentsActions.loadEnrollments());

    forkJoin({
      students: this.studentsSvc.getStudents(),
      courses: this.coursesSvc.getCourses(),
    }).subscribe(({ students, courses }) => {
      this.students = students;
      this.courses = courses;
    });

    this.store.pipe(select(selectAllEnrollments), take(1)).subscribe((list) => {
      this.allEnrollments = list;

      if (idParam) {
        this.editId = idParam;
        const existing = list.find((e) => e.id === idParam);
        if (!existing) {
          this.notFound = true;
          return;
        }
        this.form.patchValue({
          studentId: existing.studentId,
          courseId: existing.courseId,
          enrollmentDate: new Date(existing.enrollmentDate),
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

    return this.allEnrollments.some(
      (e) =>
        e.studentId === sid && e.courseId === courseId && e.id !== this.editId
    );
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    if (this.editId) {
      const updated: Enrollment = {
        id: this.editId,
        studentId: formValue.studentId,
        courseId: formValue.courseId,
        enrollmentDate: formValue.enrollmentDate,
      };
      this.store.dispatch(
        EnrollmentsActions.updateEnrollment({ enrollment: updated })
      );
    } else {
      const newPayload: Omit<Enrollment, 'id'> = {
        studentId: formValue.studentId,
        courseId: formValue.courseId,
        enrollmentDate: formValue.enrollmentDate,
      };
      this.store.dispatch(
        EnrollmentsActions.createEnrollment({ enrollment: newPayload })
      );
    }
    this.router.navigate(['/dashboard/enrollments']);
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/enrollments']);
  }
}
