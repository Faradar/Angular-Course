import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AuthActions } from '../../../../store/auth/auth.actions';
import { UIActions } from '../../../../store/ui/ui.actions';
import { Observable } from 'rxjs';
import { selectAuthError } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  authError$: Observable<string | null>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.authError$ = this.store.pipe(select(selectAuthError));
  }

  ngOnInit() {
    this.store.dispatch(UIActions.setToolbarTitle({ title: 'Login' }));
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ email, password }));
    }
  }

  register() {
    this.router.navigate(['/auth/register']);
  }
}
