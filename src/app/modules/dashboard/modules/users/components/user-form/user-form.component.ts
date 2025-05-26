import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../users.service';
import { User } from '../../../../../../models';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  editId: string | null = null;
  loading = false;
  notFound = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersSvc: UsersService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editId = idParam;
      this.loading = true;
      this.usersSvc.getUserById(idParam).subscribe((u) => {
        if (!u) {
          this.notFound = true;
        } else {
          this.form.patchValue({
            username: u.username,
            email: u.email,
            role: u.role,
          });
        }
        this.loading = false;
      });
    }
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: User = {
      ...this.form.value,
      token: this.editId ? this.form.value.token : this.generateToken(),
    } as User;

    if (this.editId) {
      payload.id = this.editId;
      this.usersSvc
        .updateUser(payload)
        .subscribe(() => this.router.navigate(['/dashboard/users']));
    } else {
      this.usersSvc
        .createUser(payload)
        .subscribe(() => this.router.navigate(['/dashboard/users']));
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/users']);
  }
}
