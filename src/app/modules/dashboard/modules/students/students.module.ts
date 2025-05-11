import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { StudentsTableComponent } from './components/students-table/students-table.component';
import { StudentFullNamePipe } from './pipes/student-full-name.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { SharedModule } from '../../../../shared/shared.module';
import { StudentDetailComponent } from './pages/student-detail/student-detail.component';

@NgModule({
  declarations: [
    StudentsComponent,
    StudentsTableComponent,
    StudentFullNamePipe,
    HighlightDirective,
    StudentDetailComponent,
  ],
  imports: [CommonModule, StudentsRoutingModule, SharedModule],
  exports: [StudentsComponent],
})
export class StudentsModule {}
