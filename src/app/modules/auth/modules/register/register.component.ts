import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../../dashboard/modules/users/users.service';
import { User } from '../../../../models';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usersSvc: UsersService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access in template
  get f() {
    return this.registerForm.controls;
  }

  get userName() {
    return this.registerForm.get('userName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  register() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const payload: Omit<User, 'id'> = {
      username: this.userName?.value,
      email: this.email?.value,
      password: this.password?.value,
      role: 'user',
      token: this.generateToken(),
    };

    this.usersSvc.createUser(payload).subscribe({
      next: (newUser) => {
        console.log('Registered user:', newUser);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Registration failed', err);
      },
    });
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
