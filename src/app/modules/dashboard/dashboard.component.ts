import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models';
import { select, Store } from '@ngrx/store';
import { selectAuthUser } from '../../store/auth/auth.selectors';
import { selectToolbarTitle } from '../../store/ui/ui.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  showFiller = false;

  authUser$: Observable<User | null>;
  toolbarTitle$: Observable<string>;

  constructor(private store: Store) {
    this.authUser$ = this.store.pipe(select(selectAuthUser));
    this.toolbarTitle$ = this.store.pipe(select(selectToolbarTitle));
  }
}
