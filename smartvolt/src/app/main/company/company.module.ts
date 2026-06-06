import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleMapsModule } from '@angular/google-maps';

import { CompanyRoutingModule } from './company-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GridComponent } from './grid/grid.component';
import { StationsComponent } from './stations/stations.component';
import { ReportsComponent } from './reports/reports.component';
import { MapComponent } from './map/map.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    GridComponent,
    StationsComponent,
    ReportsComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    GoogleMapsModule,
    ReactiveFormsModule,
  ]
})
export class CompanyModule { }
