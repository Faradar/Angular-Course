// src/app/features/enrollments/enrollments.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Enrollment } from '../../../../models';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentsService {
  // In-memory “DB”
  private enrollments: Enrollment[] = [
    {
      id: 1,
      studentId: 1,
      courseId: 2,
      enrollmentDate: new Date('2025-01-10'),
    },
    {
      id: 2,
      studentId: 3,
      courseId: 1,
      enrollmentDate: new Date('2025-02-05'),
    },
    {
      id: 3,
      studentId: 2,
      courseId: 3,
      enrollmentDate: new Date('2025-03-15'),
    },
    {
      id: 4,
      studentId: 4,
      courseId: 2,
      enrollmentDate: new Date('2025-04-20'),
    },
    {
      id: 5,
      studentId: 5,
      courseId: 1,
      enrollmentDate: new Date('2025-05-10'),
    },
    {
      id: 6,
      studentId: 6,
      courseId: 3,
      enrollmentDate: new Date('2025-06-05'),
    },
    {
      id: 7,
      studentId: 7,
      courseId: 2,
      enrollmentDate: new Date('2025-07-15'),
    },
    {
      id: 8,
      studentId: 8,
      courseId: 1,
      enrollmentDate: new Date('2025-08-20'),
    },
    {
      id: 9,
      studentId: 9,
      courseId: 3,
      enrollmentDate: new Date('2025-09-10'),
    },
    {
      id: 10,
      studentId: 10,
      courseId: 2,
      enrollmentDate: new Date('2025-10-05'),
    },
  ];

  // 1) List all
  getEnrollments(): Observable<Enrollment[]> {
    // return a clone to prevent external mutation, simulate latency
    return of(this.enrollments.map((e) => ({ ...e }))).pipe(delay(500));
  }

  // 2) Create new
  createEnrollment(e: Omit<Enrollment, 'id'>): Observable<Enrollment> {
    const newRecord: Enrollment = {
      ...e,
      id: this.enrollments.length
        ? Math.max(...this.enrollments.map((x) => x.id)) + 1
        : 1,
    };
    this.enrollments.push(newRecord);
    return of({ ...newRecord }).pipe(delay(300));
  }

  // 3) Update existing
  updateEnrollment(e: Enrollment): Observable<Enrollment> {
    const idx = this.enrollments.findIndex((x) => x.id === e.id);
    if (idx > -1) {
      this.enrollments[idx] = { ...e };
    }
    // return the updated record (or a clone)
    return of({ ...e }).pipe(delay(300));
  }

  // 4) Delete by id
  deleteEnrollment(id: number): Observable<void> {
    this.enrollments = this.enrollments.filter((x) => x.id !== id);
    return of(undefined).pipe(delay(300));
  }

  // Optional helper to fetch one
  getEnrollmentById(id: number): Observable<Enrollment | undefined> {
    return this.getEnrollments().pipe(
      map((list) => list.find((x) => x.id === id))
    );
  }
}
