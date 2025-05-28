import { Component } from '@angular/core';
import { Link, User } from '../../../../models';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { Observable } from 'rxjs';

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

  authUser$!: Observable<User | null>;

  constructor(private router: Router, private authService: AuthService) {
    this.authUser$ = this.authService.authUser$;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  trackByLink(_idx: number, link: Link): number {
    return link.id;
  }
}
