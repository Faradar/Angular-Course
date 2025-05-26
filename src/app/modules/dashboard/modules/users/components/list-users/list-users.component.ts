import { Component, OnInit } from '@angular/core';
import { User } from '../../../../../../models';
import { Observable } from 'rxjs';
import { UsersService } from '../../users.service';
import { AuthService } from '../../../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-users',
  standalone: false,
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss',
})
export class ListUsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  authUser$: Observable<User | null>;

  displayedColumns = ['id', 'username', 'email', 'role', 'actions'];

  constructor(
    private usersSvc: UsersService,
    private authSvc: AuthService,
    private router: Router
  ) {
    this.authUser$ = this.authSvc.authUser$;
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  private fetchUsers(): void {
    this.loading = true;
    this.usersSvc.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading courses', err);
        this.loading = false;
      },
    });
  }

  onNew() {
    this.router.navigate(['dashboard', 'users', 'new']);
  }

  onEdit(id: string) {
    this.router.navigate(['dashboard', 'users', 'edit', id]);
  }

  onDelete(id: string) {
    if (!confirm('Delete user?')) return;
    this.usersSvc.deleteUser(id).subscribe(() => this.fetchUsers());
  }
}
