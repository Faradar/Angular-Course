import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../../../models';
import { filter, map, Observable, take } from 'rxjs';
import { select, Store } from '@ngrx/store';
import {
  selectAllUsers,
  selectUsersError,
  selectUsersLoading,
} from '../../store/users.selectors';
import { UIActions } from '../../../../../../store/ui/ui.actions';
import { UsersActions } from '../../store/users.actions';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  editId: string | null = null;

  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  allUsers$: Observable<User[]>;

  private originalPassword: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      role: ['user', Validators.required],
      token: [''],
    });

    this.loading$ = this.store.pipe(select(selectUsersLoading));
    this.error$ = this.store.pipe(select(selectUsersError));
    this.allUsers$ = this.store.pipe(select(selectAllUsers));
  }

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    const isEdit = !!routeId;
    this.editId = routeId;

    setTimeout(() => {
      const title = isEdit ? 'Edit User' : 'New User';
      this.store.dispatch(UIActions.setToolbarTitle({ title }));
    }, 0);

    this.store.dispatch(UsersActions.loadUsers());

    if (isEdit && routeId) {
      this.allUsers$
        .pipe(
          filter((users) => users.length > 0),
          take(1),
          map((users) => users.find((u) => u.id === routeId))
        )
        .subscribe((user) => {
          if (user) {
            this.originalPassword = user.password;

            this.form.patchValue({
              username: user.username,
              email: user.email,
              role: user.role,
              token: user.token,
            });
            this.passwordControl.clearValidators();
            this.passwordControl.setValidators([Validators.minLength(6)]);
            this.passwordControl.updateValueAndValidity();
          } else {
            alert('User not found');
            this.router.navigate(['/dashboard/users']);
          }
        });
    } else {
      this.passwordControl.setValidators([
        Validators.required,
        Validators.minLength(6),
      ]);
      this.passwordControl.updateValueAndValidity();
    }
  }

  private get passwordControl(): AbstractControl {
    return this.form.get('password')!;
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    if (this.editId) {
      const finalPassword = formValue.password
        ? formValue.password
        : this.originalPassword;

      const updatedUser: User = {
        id: this.editId,
        username: formValue.username,
        email: formValue.email,
        password: finalPassword,
        role: formValue.role,
        token: formValue.token,
      };
      this.store.dispatch(UsersActions.updateUser({ user: updatedUser }));
      this.router.navigate(['/dashboard/users']);
    } else {
      const newUserPayload: Omit<User, 'id'> = {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        role: formValue.role,
        token: this.generateToken(),
      };
      this.store.dispatch(UsersActions.createUser({ user: newUserPayload }));
      this.router.navigate(['/dashboard/users']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/users']);
  }
}
