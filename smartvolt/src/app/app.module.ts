import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { GoogleLoginProvider } from "angularx-social-login";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainModule } from './main/main.module';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocialLoginModule,
    MainModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
  ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('1092631624471-77onbvn7tk0p3grqt4kuqltt3a3rm8fd.apps.googleusercontent.com')
          //cliendID: 1092631624471-77onbvn7tk0p3grqt4kuqltt3a3rm8fd.apps.googleusercontent.com
        }],
      onError: (err) => {
        console.error(err);
      }
    } as SocialAuthServiceConfig,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
