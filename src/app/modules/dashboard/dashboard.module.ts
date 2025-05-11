import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { StudentsModule } from './modules/students/students.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [DashboardComponent, NavMenuComponent],
  imports: [CommonModule, DashboardRoutingModule, StudentsModule, SharedModule],
  exports: [DashboardComponent],
})
export class DashboardModule {}
