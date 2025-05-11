import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Student } from '../../../../models';
import { SubmitErrorStateMatcher } from '../../../../errors';
import { StudentsService } from './students.service';

@Component({
  selector: 'app-students',
  standalone: false,
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
  providers: [
    {
      provide: ErrorStateMatcher,
      useFactory: (cmp: StudentsComponent) =>
        // only paint error after submit has been attempted
        new SubmitErrorStateMatcher(() => cmp.submitted),
      deps: [StudentsComponent],
    },
  ],
})
export class StudentsComponent {
  isEditingId: number | null = null;
  studentForm: FormGroup;
  submitted = false;
  students: Student[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentsService
  ) {
    this.loadStudentsObservable();

    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  loadStudentsObservable() {
    this.isLoading = true;
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
      },
      error: (error) => {
        console.error('There was an error loading the students:', error);
      },
      complete: () => {
        this.isLoading = false;
      },
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
