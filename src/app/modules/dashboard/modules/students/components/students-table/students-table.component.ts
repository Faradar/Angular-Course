import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Student, User } from '../../../../../../models';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectAuthUser } from '../../../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-students-table',
  standalone: false,
  templateUrl: './students-table.component.html',
  styleUrl: './students-table.component.scss',
})
export class StudentsTableComponent {
  displayedColumns: string[] = ['id', 'name', 'email', 'actions'];

  @Input()
  dataSource: Student[] = [];

  @Output()
  editStudent = new EventEmitter<Student>();

  @Output()
  deleteStudent = new EventEmitter<string>();

  authUser$: Observable<User | null>;

  constructor(private store: Store) {
    this.authUser$ = this.store.pipe(select(selectAuthUser));
  }
}
