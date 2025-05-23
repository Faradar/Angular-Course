import { Injectable } from '@angular/core';
import { Student, StudentForm } from '../../../../models';
import { catchError, concatMap, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private baseUrl = 'http://localhost:3000/students';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  getStudentById(id: string): Observable<Student | null> {
    return this.http
      .get<Student>(`${this.baseUrl}/${id}`)
      .pipe(catchError(() => of(null)));
  }

  createStudent(student: StudentForm): Observable<Student> {
    return this.http.post<Student>('http://localhost:3000/students', student);
  }

  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${student.id}`, student);
  }

  deleteStudent(id: string): Observable<Student[]> {
    return this.http
      .delete<Student[]>(`http://localhost:3000/students/${id}`)
      .pipe(concatMap(() => this.getStudents()));
  }
}
