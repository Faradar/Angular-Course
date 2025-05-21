import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Course } from '../../../../models';

const MOCK_DB: Course[] = [
  {
    id: 1,
    name: 'Angular Basics',
    description: 'Introduction to Angular',
    durationHours: 10,
  },
  {
    id: 2,
    name: 'Angular Advanced',
    description: 'Advanced in Angular',
    durationHours: 20,
  },
  {
    id: 3,
    name: 'Angular Professional',
    description: 'Professional in Angular',
    durationHours: 30,
  },
  {
    id: 4,
    name: 'Angular Master',
    description: 'Master in Angular',
    durationHours: 40,
  },
  {
    id: 5,
    name: 'Angular Master Pro',
    description: 'Master Pro in Angular',
    durationHours: 50,
  },
  {
    id: 6,
    name: 'Angular Master Pro Max',
    description: 'Master Pro Max in Angular',
    durationHours: 60,
  },
  {
    id: 7,
    name: 'Angular Master Pro Max Ultra',
    description: 'Master Pro Max Ultra in Angular',
    durationHours: 70,
  },
  {
    id: 8,
    name: 'Angular Master Pro Max Ultra Max',
    description: 'Master Pro Max Ultra Max in Angular',
    durationHours: 80,
  },
  {
    id: 9,
    name: 'Angular Master Pro Max Ultra Max Max',
    description: 'Master Pro Max Ultra Max Max in Angular',
    durationHours: 90,
  },
  {
    id: 10,
    name: 'Angular Master Pro Max Ultra Max Max Max',
    description: 'Master Pro Max Ultra Max Max Max in Angular',
    durationHours: 100,
  },
];

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private courses = [...MOCK_DB];

  getCourses(): Observable<Course[]> {
    return of(this.courses).pipe(delay(500));
  }

  createCourse(course: Course): Observable<Course> {
    course.id = this.courses.length + 1;
    this.courses.push(course);
    return of(course).pipe(delay(300));
  }

  updateCourse(course: Course): Observable<Course> {
    const idx = this.courses.findIndex((c) => c.id === course.id);
    if (idx > -1) this.courses[idx] = course;
    return of(course).pipe(delay(300));
  }

  deleteCourse(id: number): Observable<void> {
    this.courses = this.courses.filter((c) => c.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
