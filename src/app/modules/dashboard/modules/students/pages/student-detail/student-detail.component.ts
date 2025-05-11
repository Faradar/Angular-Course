import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Student } from '../../../../../../models';
import { StudentsService } from '../../students.service';

@Component({
  selector: 'app-student-detail',
  standalone: false,
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss',
})
export class StudentDetailComponent {
  student: Observable<Student | null>;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentsService
  ) {
    // console.log(this.route);
    const studentId = this.route.snapshot.params['id'];

    this.student = this.studentService.getStudentById(studentId);
    console.log('Student Id:', studentId);
    console.log('Query Params:', this.route.snapshot.queryParams);
  }
}
