import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Student } from '../../../../models';

@Component({
  selector: 'app-students',
  standalone: false,
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent {
  isEditingId: number | null = null;
  studentForm: FormGroup;

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
      firstName: [''],
      email: [''],
    });
  }

  onSubmit() {
    if (this.isEditingId) {
      this.students = this.students.map((student) =>
        student.id === this.isEditingId
          ? { ...student, ...this.studentForm.value }
          : student
      );
    } else {
      const newStudent = this.studentForm.value;
      newStudent.id = this.students.length + 1;

      console.log('newStudent', newStudent);

      this.students = [...this.students, newStudent];
    }
    this.studentForm.reset();
    this.isEditingId = null;
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
