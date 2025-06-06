import { Component } from '@angular/core';
import { Link, User } from '../../../../models';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../../store/auth/auth.actions';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-nav-menu',
  standalone: false,
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  list: Link[] = [
    { id: 1, label: 'Students', url: 'students', isActive: false },
    { id: 2, label: 'Courses', url: 'courses', isActive: false },
    { id: 3, label: 'Enrollments', url: 'enrollments', isActive: false },
    { id: 4, label: 'Users', url: 'users', isActive: false },
  ];

  authUser$: Observable<User | null>;

  constructor(private store: Store) {
    this.authUser$ = this.store.select(selectAuthUser);
  }

  logout() {
    localStorage.removeItem('token');
    this.store.dispatch(AuthActions.logout());
  }

  trackByLink(_idx: number, link: Link): number {
    return link.id;
  }
}
