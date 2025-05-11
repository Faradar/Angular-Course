import { Injectable } from '@angular/core';
import { Student } from '../../../../models';
import { map, Observable, of } from 'rxjs';

const MY_FAKE_DB: Student[] = [
  {
    id: 1,
    firstName: 'Mary',
    lastName: 'Smith',
    email: 'mary.smith@example.com',
  },
  {
    id: 2,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  },
  {
    id: 3,
    firstName: 'Alice',
    lastName: 'Jones',
    email: 'alice.jones@example.com',
  },
  {
    id: 4,
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@example.com',
  },
  {
    id: 5,
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.wilson@example.com',
  },
  {
    id: 6,
    firstName: 'Michael',
    lastName: 'Lee',
    email: 'michael.lee@example.com',
  },
  {
    id: 7,
    firstName: 'Laura',
    lastName: 'Kim',
    email: 'laura.kim@example.com',
  },
  {
    id: 8,
    firstName: 'David',
    lastName: 'Garcia',
    email: 'david.garcia@example.com',
  },
  {
    id: 9,
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.martinez@example.com',
  },
  {
    id: 10,
    firstName: 'Daniel',
    lastName: 'Wong',
    email: 'daniel.wong@example.com',
  },
];

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  getStudents(): Observable<Student[]> {
    const studentObservable = new Observable<Student[]>((observer) => {
      setTimeout(() => {
        observer.next(MY_FAKE_DB);
        observer.complete();
      }, 1000);
    });

    return studentObservable;
  }

  getStudentById(id: number): Observable<Student | null> {
    return of([...MY_FAKE_DB]).pipe(
      map((students) => students.find((student) => student.id == id) || null)
    );
  }
}
