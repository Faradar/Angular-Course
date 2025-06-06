import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ListEnrollmentsComponent } from './list-enrollments.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../../../../shared/shared.module';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';

import {
  selectAllEnrollments,
  selectEnrollmentsLoading,
  selectEnrollmentsError,
} from '../../store/enrollments.selectors';
import { EnrollmentsActions } from '../../store/enrollments.actions';
import { selectAuthUser } from '../../../../../../store/auth/auth.selectors';
import { UIActions } from '../../../../../../store/ui/ui.actions';

import { StudentsService } from '../../../students/students.service';
import { CoursesService } from '../../../courses/courses.service';

import { Enrollment, Student, Course, User } from '../../../../../../models';
import { of } from 'rxjs';

describe('ListEnrollmentsComponent', () => {
  let store: MockStore;
  let mockSelectEnrollments: MemoizedSelector<unknown, Enrollment[]>;
  let mockSelectLoading: MemoizedSelector<unknown, boolean>;
  let mockSelectError: MemoizedSelector<unknown, string | null>;
  let mockSelectAuthUser: MemoizedSelector<unknown, User | null>;

  let component: ListEnrollmentsComponent;
  let fixture: ComponentFixture<ListEnrollmentsComponent>;

  let studentsSvcSpy: jasmine.SpyObj<StudentsService>;
  let coursesSvcSpy: jasmine.SpyObj<CoursesService>;

  beforeEach(async () => {
    studentsSvcSpy = jasmine.createSpyObj('StudentsService', ['getStudents']);
    coursesSvcSpy = jasmine.createSpyObj('CoursesService', ['getCourses']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      declarations: [ListEnrollmentsComponent],
      providers: [
        { provide: StudentsService, useValue: studentsSvcSpy },
        { provide: CoursesService, useValue: coursesSvcSpy },
        provideMockStore({ initialState: {} }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    mockSelectEnrollments = store.overrideSelector(selectAllEnrollments, []);
    mockSelectLoading = store.overrideSelector(selectEnrollmentsLoading, false);
    mockSelectError = store.overrideSelector(selectEnrollmentsError, null);
    mockSelectAuthUser = store.overrideSelector(selectAuthUser, null);

    fixture = TestBed.createComponent(ListEnrollmentsComponent);
    component = fixture.componentInstance;
  });

  it('should dispatch loadEnrollments on init and populate maps from the services', fakeAsync(() => {
    const fakeEnrollments: Enrollment[] = [
      {
        id: 'e1',
        studentId: 's1',
        courseId: 'c1',
        enrollmentDate: new Date('2025-01-01'),
      },
    ];
    const fakeStudents: Student[] = [
      { id: 's1', firstName: 'John', lastName: 'Doe', email: '' },
    ];
    const fakeCourses: Course[] = [
      { id: 'c1', name: 'Course 1', description: '', durationHours: 5 },
    ];
    const fakeUser = {
      id: 'u1',
      email: 'test@example.com',
    } as User;

    mockSelectEnrollments.setResult(fakeEnrollments);
    mockSelectLoading.setResult(false);
    mockSelectError.setResult(null);
    mockSelectAuthUser.setResult(fakeUser);

    spyOn(store, 'dispatch');

    studentsSvcSpy.getStudents.and.returnValue(of(fakeStudents));
    coursesSvcSpy.getCourses.and.returnValue(of(fakeCourses));

    fixture.detectChanges();
    tick();

    tick(1);

    const expectedTitleAction = UIActions.setToolbarTitle({
      title: 'Enrollments',
    });
    const expectedLoadAction = EnrollmentsActions.loadEnrollments();
    expect(store.dispatch).toHaveBeenCalledWith(expectedTitleAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedLoadAction);

    expect(studentsSvcSpy.getStudents).toHaveBeenCalledTimes(1);
    expect(component.studentsMap.get('s1')?.firstName).toBe('John');

    expect(coursesSvcSpy.getCourses).toHaveBeenCalledTimes(1);
    expect(component.coursesMap.get('c1')?.name).toBe('Course 1');

    let emittedEnrollments: Enrollment[] | undefined;
    component.enrollments$.subscribe((list) => (emittedEnrollments = list));
    expect(emittedEnrollments).toEqual(fakeEnrollments);

    let emittedLoading: boolean | undefined;
    let emittedError: string | null | undefined;
    component.loading$.subscribe((l) => (emittedLoading = l));
    component.error$.subscribe((e) => (emittedError = e));
    expect(emittedLoading).toBe(false);
    expect(emittedError).toBeNull();

    let emittedUser: User | null | undefined;
    component.authUser$.subscribe((u) => (emittedUser = u));
    expect(emittedUser).toEqual(fakeUser);
  }));

  it('should dispatch deleteEnrollment when onDelete is confirmed', fakeAsync(() => {
    const fakeEnrollments: Enrollment[] = [
      {
        id: 'e2',
        studentId: 's2',
        courseId: 'c2',
        enrollmentDate: new Date('2025-02-02'),
      },
    ];
    mockSelectEnrollments.setResult(fakeEnrollments);
    mockSelectLoading.setResult(false);
    mockSelectError.setResult(null);
    mockSelectAuthUser.setResult(null);

    studentsSvcSpy.getStudents.and.returnValue(of([]));
    coursesSvcSpy.getCourses.and.returnValue(of([]));

    spyOn(store, 'dispatch');

    spyOn(window, 'confirm').and.returnValue(true);

    fixture.detectChanges();
    tick();

    tick(1);

    component.onDelete('e2');
    tick();

    const expectedDeleteAction = EnrollmentsActions.deleteEnrollment({
      id: 'e2',
    });
    expect(store.dispatch).toHaveBeenCalledWith(expectedDeleteAction);
  }));
});
