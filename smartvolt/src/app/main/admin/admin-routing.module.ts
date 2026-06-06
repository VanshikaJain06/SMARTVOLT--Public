import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from 'src/app/page-not-found/page-not-found.component';
import { CompanyComponent } from './company/company.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EvComponent } from './ev/ev.component';
import { EvseComponent } from './evse/evse.component';
import { GridComponent } from './grid/grid.component';
import { ReportsComponent } from './reports/reports.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Dashboard',
        component: DashboardComponent
      },
      {
        path: 'Grid',
        component: GridComponent
      },
      {
        path: 'User',
        component: UserComponent
      },
      {
        path: 'Company',
        component: CompanyComponent
      },
      {
        path: 'EV',
        component: EvComponent
      },
      {
        path: 'EVSE',
        component: EvseComponent
      },
      {
        path: 'Reports',
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
export class AdminRoutingModule { }
