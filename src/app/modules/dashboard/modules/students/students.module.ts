import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { StudentsTableComponent } from './components/students-table/students-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { StudentFullNamePipe } from './pipes/student-full-name.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    StudentsComponent,
    StudentsTableComponent,
    StudentFullNamePipe,
    HighlightDirective,
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule,
  ],
  exports: [StudentsComponent],
})
export class StudentsModule {}
