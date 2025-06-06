import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Student, User } from '../../../../models';
import { SubmitErrorStateMatcher } from '../../../../errors';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { select, Store } from '@ngrx/store';
import { UIActions } from '../../../../store/ui/ui.actions';
import {
  selectAllStudents,
  selectStudentsError,
  selectStudentsLoading,
} from './store/students.selectors';
import { StudentsActions } from './store/students.actions';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';

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
export class StudentsComponent implements OnInit {
  students$: Observable<Student[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  authUser$: Observable<User | null>;

  studentForm: FormGroup;
  submitted = false;
  isEditingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store
  ) {
    this.students$ = this.store.pipe(select(selectAllStudents));
    this.loading$ = this.store.pipe(select(selectStudentsLoading));
    this.error$ = this.store.pipe(select(selectStudentsError));
    this.authUser$ = this.store.pipe(select(selectAuthUser));

    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UIActions.setToolbarTitle({ title: 'Students' }));
    }, 0);

    this.store.dispatch(StudentsActions.loadStudents());
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

  onSubmit(): void {
    this.submitted = true;
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const formValue = this.studentForm.value;
    if (this.isEditingId) {
      const updatedStudent: Student = {
        id: this.isEditingId,
        ...formValue,
      };
      this.store.dispatch(
        StudentsActions.updateStudent({ student: updatedStudent })
      );
    } else {
      const newStudentPayload: Omit<Student, 'id'> = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
      };
      this.store.dispatch(
        StudentsActions.createStudent({ student: newStudentPayload })
      );
    }
    this.clearForm();
  }

  onEditStudent(student: Student): void {
    this.isEditingId = student.id;
    this.studentForm.patchValue(student);
  }

  onDeleteStudent(id: string): void {
    if (!confirm('¿Estás seguro de eliminar este estudiante?')) return;
    this.store.dispatch(StudentsActions.deleteStudent({ id }));
  }

  @HostListener('window:keydown.escape', ['$event'])
  onEscPressed(event: KeyboardEvent) {
    this.clearForm();
  }

  clearForm(): void {
    this.studentForm.reset();
    this.isEditingId = null;
    this.submitted = false;
  }
}
