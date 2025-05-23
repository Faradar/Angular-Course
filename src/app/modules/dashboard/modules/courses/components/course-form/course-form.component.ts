import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Course } from '../../../../../../models';
import { CoursesService } from '../../courses.service';

@Component({
  selector: 'app-course-form',
  standalone: false,
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
})
export class CourseFormComponent implements OnInit {
  form!: FormGroup;
  editId: string | null = null;
  loading = false;
  notFound = false;

  constructor(
    private fb: FormBuilder,
    private svc: CoursesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      durationHours: [0, [Validators.required, Validators.min(1)]],
    });

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.editId = idParam;
      this.fetchCourse(this.editId);
    }
  }

  private fetchCourse(id: string): void {
    this.loading = true;
    this.svc.getCourses().subscribe({
      next: (list) => {
        const course = list.find((c) => c.id === id);
        if (course) {
          this.form.patchValue(course);
        } else {
          this.notFound = true;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching course', err);
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

    const payload: Course = { ...this.form.value } as Course;
    if (this.editId) {
      payload.id = this.editId;
      this.svc
        .updateCourse(payload)
        .subscribe(() => this.router.navigate(['/dashboard/courses']));
    } else {
      this.svc
        .createCourse(payload)
        .subscribe(() => this.router.navigate(['/dashboard/courses']));
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/courses']);
  }
}
