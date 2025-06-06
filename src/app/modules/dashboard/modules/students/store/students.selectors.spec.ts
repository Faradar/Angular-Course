import {
  selectAllStudents,
  selectStudentsLoading,
  selectStudentsError,
} from './students.selectors';
import { StudentsState } from './students.reducer';
import { Student } from '../../../../../models';

describe('Students Selectors', () => {
  const mockStudentList: Student[] = [
    {
      id: 'a1',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
    },
    { id: 'b2', firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com' },
  ];

  const mockState: { students: StudentsState } = {
    students: {
      list: mockStudentList,
      loading: true,
      error: 'Something went wrong',
    },
  };

  it('should select the entire student list', () => {
    const selected = selectAllStudents.projector(mockState.students);
    expect(selected).toBe(mockStudentList);
  });

  it('should select the loading boolean', () => {
    const loading = selectStudentsLoading.projector(mockState.students);
    expect(loading).toBeTrue();
  });

  it('should select the error message', () => {
    const error = selectStudentsError.projector(mockState.students);
    expect(error).toEqual('Something went wrong');
  });
});
