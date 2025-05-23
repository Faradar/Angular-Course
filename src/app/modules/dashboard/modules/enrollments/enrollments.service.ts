// src/app/features/enrollments/enrollments.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { Enrollment } from '../../../../models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentsService {
  private baseUrl = 'http://localhost:3000/enrollments';

  constructor(private http: HttpClient) {}

  getEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.baseUrl);
  }

  getEnrollmentById(id: string): Observable<Enrollment | undefined> {
    return this.http
      .get<Enrollment>(`${this.baseUrl}/${id}`)
      .pipe(catchError(() => of(undefined)));
  }

  createEnrollment(e: Omit<Enrollment, 'id'>): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.baseUrl, e);
  }

  updateEnrollment(e: Enrollment): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.baseUrl}/${e.id}`, e);
  }

  deleteEnrollment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
