import { Component, OnInit } from '@angular/core';
import { Course } from '../../../../../../models';
import { CoursesService } from '../../courses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-courses',
  standalone: false,
  templateUrl: './list-courses.component.html',
  styleUrl: './list-courses.component.scss',
})
export class ListCoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = false;
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'duration',
    'actions',
  ];

  constructor(private svc: CoursesService, private router: Router) {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  private fetchCourses(): void {
    this.loading = true;
    this.svc.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading courses', err);
        this.loading = false;
      },
    });
  }

  onEdit(course: Course): void {
    this.router.navigate(['dashboard', 'courses', 'edit', course.id]);
  }

  onDelete(id: number): void {
    if (!confirm('Delete this course?')) {
      return;
    }
    this.svc.deleteCourse(id).subscribe({
      next: () => this.fetchCourses(),
      error: (err) => console.error('Delete failed', err),
    });
  }

  onNew(): void {
    this.router.navigate(['/dashboard/courses/new']);
  }
}
