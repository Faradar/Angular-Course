import { Pipe, PipeTransform } from '@angular/core';
import { Student } from '../../../../../models';

@Pipe({
  name: 'studentFullName',
  standalone: false,
})
export class StudentFullNamePipe implements PipeTransform {
  transform(value: Student) {
    return value.firstName + ' ' + value.lastName;
  }
}
