import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleMapsModule } from '@angular/google-maps';

import { UserRoutingModule } from './user-routing.module';
import { MapComponent } from './map/map.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookingComponent } from './booking/booking.component';
import { EvComponent } from './ev/ev.component';
import { BatteryComponent } from './battery/battery.component';
import { ReportsComponent } from './reports/reports.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MapComponent,
    DashboardComponent,
    BookingComponent,
    EvComponent,
    BatteryComponent,
    ReportsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    GoogleMapsModule,
    ReactiveFormsModule,
  ],
})
export class UserModule { }
