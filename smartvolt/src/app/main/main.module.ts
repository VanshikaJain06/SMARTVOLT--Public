import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { AdminModule } from './admin/admin.module';


@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    UserModule,
    CompanyModule,
    AdminModule,
  ]
})
export class MainModule { }
