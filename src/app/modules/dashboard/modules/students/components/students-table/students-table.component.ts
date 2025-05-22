import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Student, User } from '../../../../../../models';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../../../core/services/auth.service';

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
  deleteStudent = new EventEmitter<number>();

  authUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.authUser$ = this.authService.authUser$;
  }
}
