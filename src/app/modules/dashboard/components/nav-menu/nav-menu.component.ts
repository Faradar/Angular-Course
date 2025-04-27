import { Component } from '@angular/core';
import { Link } from '../../../../models';

@Component({
  selector: 'app-nav-menu',
  standalone: false,
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  list: Link[] = [
    { id: 1, label: 'Home', url: '/home', isActive: false },
    { id: 2, label: 'Students', url: '/students', isActive: true },
    { id: 3, label: 'Logout', url: '/logout', isActive: false },
  ];

  trackByLink(_idx: number, link: Link): number {
    return link.id;
  }
}
