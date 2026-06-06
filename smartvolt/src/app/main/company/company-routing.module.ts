import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from 'src/app/page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GridComponent } from './grid/grid.component';
import { MapComponent } from './map/map.component';
import { ReportsComponent } from './reports/reports.component';
import { StationsComponent } from './stations/stations.component';

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
        path: 'Grid',
        component: GridComponent
      },
      {
        path: 'Stations',
        component: StationsComponent
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
export class CompanyRoutingModule { }
