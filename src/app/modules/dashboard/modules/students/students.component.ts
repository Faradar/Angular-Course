import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Student } from '../../../../models';
import { SubmitErrorStateMatcher } from '../../../../errors';

@Component({
  selector: 'app-students',
  standalone: false,
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
  providers: [
    {
      // only paint error after submit has been attempted
      provide: ErrorStateMatcher,
      useFactory: (cmp: StudentsComponent) =>
        new SubmitErrorStateMatcher(() => cmp.submitted),
      deps: [StudentsComponent],
    },
  ],
})
export class StudentsComponent {
  isEditingId: number | null = null;
  studentForm: FormGroup;
  submitted = false;

  students: Student[] = [
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

  constructor(private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get firstName() {
    return this.studentForm.get('firstName');
  }
  get lastName() {
    return this.studentForm.get('lastName');
  }
  get email() {
    return this.studentForm.get('email');
  }

  onSubmit() {
    this.submitted = true;
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    if (this.isEditingId) {
      this.students = this.students.map((student) =>
        student.id === this.isEditingId
          ? { ...student, ...this.studentForm.value }
          : student
      );
    } else {
      const newStudent = this.studentForm.value;
      newStudent.id = this.students.length + 1;

      this.students = [...this.students, newStudent];
    }

    this.isEditingId = null;
    this.studentForm.reset();
    this.submitted = false;
  }

  onEditStudent(student: Student) {
    this.isEditingId = student.id;
    this.studentForm.patchValue(student);
  }

  onDeleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.students = this.students.filter((student) => student.id !== id);
    }
  }
}
