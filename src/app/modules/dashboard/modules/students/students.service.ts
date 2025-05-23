import { Injectable } from '@angular/core';
import { Student, StudentForm } from '../../../../models';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// const MY_FAKE_DB: Student[] = [
//   {
//     id: '1',
//     firstName: 'Mary',
//     lastName: 'Smith',
//     email: 'mary.smith@example.com',
//   },
//   {
//     id: '2',
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'john.doe@example.com',
//   },
//   {
//     id: '3',
//     firstName: 'Alice',
//     lastName: 'Jones',
//     email: 'alice.jones@example.com',
//   },
//   {
//     id: '4',
//     firstName: 'Robert',
//     lastName: 'Brown',
//     email: 'robert.brown@example.com',
//   },
//   {
//     id: '5',
//     firstName: 'Emma',
//     lastName: 'Wilson',
//     email: 'emma.wilson@example.com',
//   },
//   {
//     id: '6',
//     firstName: 'Michael',
//     lastName: 'Lee',
//     email: 'michael.lee@example.com',
//   },
//   {
//     id: '7',
//     firstName: 'Laura',
//     lastName: 'Kim',
//     email: 'laura.kim@example.com',
//   },
//   {
//     id: '8',
//     firstName: 'David',
//     lastName: 'Garcia',
//     email: 'david.garcia@example.com',
//   },
//   {
//     id: '9',
//     firstName: 'Sophia',
//     lastName: 'Martinez',
//     email: 'sophia.martinez@example.com',
//   },
//   {
//     id: '10',
//     firstName: 'Daniel',
//     lastName: 'Wong',
//     email: 'daniel.wong@example.com',
//   },
// ];

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private baseUrl = 'http://localhost:3000/students';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    // const studentObservable = new Observable<Student[]>((observer) => {
    //   setTimeout(() => {
    //     observer.next(MY_FAKE_DB);
    //     observer.complete();
    //   }, 1000);
    // });

    // return studentObservable;

    return this.http.get<Student[]>(this.baseUrl);
  }

  // getStudentById(id: string): Observable<Student | null> {
  //   return of([...MY_FAKE_DB]).pipe(
  //     map((students) => students.find((student) => student.id == id) || null)
  //   );
  // }

  /** Fetch a single student by its JSON‐Server ID (e.g. "3a22") */
  getStudentById(id: string): Observable<Student | null> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`).pipe(
      // if 404 or network error, return null so your detail component can show “not found”
      catchError(() => of(null))
    );
  }

  createStudent(student: StudentForm): Observable<Student> {
    return this.http.post<Student>('http://localhost:3000/students', student);
  }

  // … and you can add update/delete the same way:
  // updateStudent(s: Student) { return this.http.put<Student>(`${this.baseUrl}/${s.id}`, s); }
  // deleteStudent(id: string) { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}
