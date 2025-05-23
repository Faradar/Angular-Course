import { Injectable } from '@angular/core';
import { Observable, of, delay, catchError } from 'rxjs';
import { Course } from '../../../../models';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private baseUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl);
  }

  getCourseById(id: string): Observable<Course | undefined> {
    return this.http
      .get<Course>(`${this.baseUrl}/${id}`)
      .pipe(catchError(() => of(undefined)));
  }

  createCourse(payload: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, payload);
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/${course.id}`, course);
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
