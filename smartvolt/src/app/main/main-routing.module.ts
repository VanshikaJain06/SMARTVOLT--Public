import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(data => data.UserModule)
      },
      {
        path: 'company',
        loadChildren: () => import('./company/company.module').then(data => data.CompanyModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(data => data.AdminModule)
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
export class MainRoutingModule { }
