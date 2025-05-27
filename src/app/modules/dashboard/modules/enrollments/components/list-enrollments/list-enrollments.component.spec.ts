import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ListEnrollmentsComponent } from './list-enrollments.component';
import { EnrollmentsService } from '../../enrollments.service';
import { StudentsService } from '../../../students/students.service';
import { CoursesService } from '../../../courses/courses.service';
import { AuthService } from '../../../../../../core/services/auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../../../../shared/shared.module';
import { Course, Enrollment, Student } from '../../../../../../models';

describe('ListEnrollmentsComponent', () => {
  let component: ListEnrollmentsComponent;
  let fixture: ComponentFixture<ListEnrollmentsComponent>;
  let mockEnrollSvc: jasmine.SpyObj<EnrollmentsService>;
  let mockStudentSvc: jasmine.SpyObj<StudentsService>;
  let mockCourseSvc: jasmine.SpyObj<CoursesService>;
  let mockAuthSvc: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockEnrollSvc = jasmine.createSpyObj('EnrollmentsService', [
      'getEnrollments',
      'deleteEnrollment',
    ]);
    mockStudentSvc = jasmine.createSpyObj('StudentsService', ['getStudents']);
    mockCourseSvc = jasmine.createSpyObj('CoursesService', ['getCourses']);
    mockAuthSvc = jasmine.createSpyObj('AuthService', [], {
      authUser$: of(null),
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      declarations: [ListEnrollmentsComponent],
      providers: [
        { provide: EnrollmentsService, useValue: mockEnrollSvc },
        { provide: StudentsService, useValue: mockStudentSvc },
        { provide: CoursesService, useValue: mockCourseSvc },
        { provide: AuthService, useValue: mockAuthSvc },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListEnrollmentsComponent);
    component = fixture.componentInstance;
  });

  it('should fetch and display enrollments', fakeAsync(() => {
    const enrollments: Enrollment[] = [
      {
        id: 'e1',
        studentId: 's1',
        courseId: 'c1',
        enrollmentDate: new Date('2025-01-01'),
      },
    ];
    const students: Student[] = [
      { id: 's1', firstName: 'John', lastName: 'Doe', email: '' },
    ];
    const courses: Course[] = [
      { id: 'c1', name: 'Course 1', description: '', durationHours: 1 },
    ];

    mockStudentSvc.getStudents.and.returnValue(of(students));
    mockCourseSvc.getCourses.and.returnValue(of(courses));
    mockEnrollSvc.getEnrollments.and.returnValue(of(enrollments));

    fixture.detectChanges();
    tick();

    expect(component.studentsMap.get('s1')?.firstName).toBe('John');
    expect(component.coursesMap.get('c1')?.name).toBe('Course 1');
    expect(component.enrollments.length).toBe(1);
  }));

  it('should call deleteEnrollment and refresh on delete', fakeAsync(() => {
    const enrollments: Enrollment[] = [
      {
        id: 'e1',
        studentId: 's1',
        courseId: 'c1',
        enrollmentDate: new Date('2025-01-01'),
      },
    ];
    mockStudentSvc.getStudents.and.returnValue(of([]));
    mockCourseSvc.getCourses.and.returnValue(of([]));
    mockEnrollSvc.getEnrollments.and.returnValue(of(enrollments));
    mockEnrollSvc.deleteEnrollment.and.returnValue(of(void 0));

    fixture.detectChanges();
    tick();

    spyOn(window, 'confirm').and.returnValue(true);
    component.onDelete('e1');
    tick();

    expect(mockEnrollSvc.deleteEnrollment).toHaveBeenCalledWith('e1');
    expect(mockEnrollSvc.getEnrollments).toHaveBeenCalledTimes(2); // initial + after delete
  }));
});
