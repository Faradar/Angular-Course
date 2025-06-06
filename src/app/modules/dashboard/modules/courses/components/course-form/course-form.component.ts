import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../../../../../../models';
import { select, Store } from '@ngrx/store';
import { UIActions } from '../../../../../../store/ui/ui.actions';
import { map, Observable, take } from 'rxjs';
import {
  selectAllCourses,
  selectCoursesLoading,
} from '../../store/courses.selectors';
import { CoursesActions } from '../../store/courses.actions';

@Component({
  selector: 'app-course-form',
  standalone: false,
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
})
export class CourseFormComponent implements OnInit {
  form!: FormGroup;
  editId: string | null = null;
  loading$: Observable<boolean>;
  notFound = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.loading$ = this.store.pipe(select(selectCoursesLoading));
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const isEdit = !!idParam;
    this.editId = idParam;

    const title = isEdit ? 'Edit Course' : 'New Course';
    setTimeout(() => {
      this.store.dispatch(UIActions.setToolbarTitle({ title }));
    }, 0);

    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      durationHours: [0, [Validators.required, Validators.min(1)]],
    });

    this.store.dispatch(CoursesActions.loadCourses());

    if (idParam) {
      this.store
        .pipe(
          select(selectAllCourses),
          map((list) => list.find((c) => c.id === idParam)),
          take(1)
        )
        .subscribe((course) => {
          if (course) {
            this.form.patchValue(course);
          } else {
            this.notFound = true;
          }
        });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    if (this.editId) {
      const updatedCourse: Course = {
        id: this.editId,
        name: formValue.name,
        description: formValue.description,
        durationHours: formValue.durationHours,
      };
      this.store.dispatch(
        CoursesActions.updateCourse({ course: updatedCourse })
      );
      this.router.navigate(['/dashboard/courses']);
    } else {
      const newCoursePayload: Omit<Course, 'id'> = {
        name: formValue.name,
        description: formValue.description,
        durationHours: formValue.durationHours,
      };
      this.store.dispatch(
        CoursesActions.createCourse({ course: newCoursePayload })
      );
      this.router.navigate(['/dashboard/courses']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/courses']);
  }
}
