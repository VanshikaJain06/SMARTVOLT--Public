import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from 'src/app/page-not-found/page-not-found.component';
import { BatteryComponent } from './battery/battery.component';
import { BookingComponent } from './booking/booking.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { EvComponent } from './ev/ev.component';
import { MapComponent } from './map/map.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Dashboard',
        component: DashboardComponent
      },
      {
        path: 'Map',
        component: MapComponent
      },
      {
        path: 'Booking',
        component: BookingComponent
      },
      {
        path: 'EVs',
        component: EvComponent
      },
      {
        path: 'Battery',
        component: BatteryComponent
      },
      {
        path: 'Support',
        component: ReportsComponent
      },
      {
        path: '**',
        component: PageNotFoundComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
