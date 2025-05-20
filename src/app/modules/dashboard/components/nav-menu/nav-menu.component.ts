import { Component } from '@angular/core';
import { Link } from '../../../../models';
import { Router } from '@angular/router';

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
  ];

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/auth/login']);
  }

  trackByLink(_idx: number, link: Link): number {
    return link.id;
  }
}
