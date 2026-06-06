import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { CompanyComponent } from './company/company.component';
import { EvComponent } from './ev/ev.component';
import { EvseComponent } from './evse/evse.component';
import { ReportsComponent } from './reports/reports.component';
import { GridComponent } from './grid/grid.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    CompanyComponent,
    EvComponent,
    EvseComponent,
    ReportsComponent,
    GridComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AdminModule { }
