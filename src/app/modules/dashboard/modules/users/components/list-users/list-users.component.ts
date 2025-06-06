import { Component, OnInit } from '@angular/core';
import { User } from '../../../../../../models';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { UIActions } from '../../../../../../store/ui/ui.actions';
import {
  selectAllUsers,
  selectUsersError,
  selectUsersLoading,
} from '../../store/users.selectors';
import { selectAuthUser } from '../../../../../../store/auth/auth.selectors';
import { UsersActions } from '../../store/users.actions';

@Component({
  selector: 'app-list-users',
  standalone: false,
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss',
})
export class ListUsersComponent implements OnInit {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  authUser$: Observable<User | null>;

  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'actions'];

  constructor(private store: Store, private router: Router) {
    this.users$ = this.store.pipe(select(selectAllUsers));
    this.loading$ = this.store.pipe(select(selectUsersLoading));
    this.error$ = this.store.pipe(select(selectUsersError));
    this.authUser$ = this.store.pipe(select(selectAuthUser));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UIActions.setToolbarTitle({ title: 'Users' }));
    }, 0);

    this.store.dispatch(UsersActions.loadUsers());
  }

  onNew(): void {
    this.router.navigate(['/dashboard/users/new']);
  }

  onEdit(userId: string): void {
    this.router.navigate(['/dashboard/users/edit', userId]);
  }

  onDelete(userId: string): void {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    this.store.dispatch(UsersActions.deleteUser({ id: userId }));
  }
}
