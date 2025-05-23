import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Student, User } from '../../../../models';
import { SubmitErrorStateMatcher } from '../../../../errors';
import { StudentsService } from './students.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

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
  isEditingId: string | null = null;
  studentForm: FormGroup;
  submitted = false;
  students: Student[] = [];
  isLoading = false;

  authUser$: Observable<User | null>;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentsService,
    private authService: AuthService
  ) {
    this.authUser$ = this.authService.authUser$;
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

    const formValue = this.studentForm.value;
    if (this.isEditingId) {
      const updated: Student = {
        id: this.isEditingId,
        ...formValue,
      };

      this.studentService.updateStudent(updated).subscribe({
        next: (res) => {
          this.students = this.students.map((s) => (s.id === res.id ? res : s));
        },
        error: (err) => {
          console.error('Error updating student', err);
        },
        complete: () => {
          console.log('Student updated successfully');
          this.clearForm();
        },
      });
    } else {
      this.studentService.createStudent(formValue).subscribe({
        next: (res) => {
          this.students = [...this.students, res];
        },
        error: (err) => {
          console.error('Error creating student', err);
        },
        complete: () => {
          console.log('Student created successfully');
          this.clearForm();
        },
      });
    }
  }

  onEditStudent(student: Student) {
    this.isEditingId = student.id;
    this.studentForm.patchValue(student);
  }

  onDeleteStudent(id: string) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id.toLocaleString()).subscribe({
        next: (students) => {
          this.students = students;
        },
        error: (error) => {
          console.error('Error deleting student', error);
        },
        complete: () => {
          console.log('Student deleted successfully');
        },
      });
    }
  }

  // Clear form by pressing ESC
  @HostListener('window:keydown.escape', ['$event'])
  onEscPressed(event: KeyboardEvent) {
    this.clearForm();
  }

  clearForm() {
    this.studentForm.reset();
    this.isEditingId = null;
    this.submitted = false;
  }
}
