import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Student } from '../../../../../../models';

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
}
