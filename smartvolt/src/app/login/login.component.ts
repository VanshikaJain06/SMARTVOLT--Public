import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider } from "angularx-social-login";
import { DataService } from '../data.service';
import { MatSnackBar } from "@angular/material/snack-bar";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

  email: any;
  access: string;

  constructor(private authService: SocialAuthService, public router: Router, public http: HttpClient, private dataService: DataService, public snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.email = ''
    this.access = ''
  }

  async login(): Promise<any>{
    //Oauth
    await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe({
      next: (data) => {
        this.email = data.email;

        //database verification
        this.http.get("http://localhost:9000/auth", {params: {"email": this.email}})
        .subscribe({
          next: data => {
            this.access = Object.values(data)[0]
            if(this.access != 'register'){
              this.dataService.update(data)
              this.router.navigate(['/main/' + this.access + '/Dashboard']);
            }
            else if(this.access == 'register'){
              this.dataService.update({email: this.email})
              this.router.navigate(['/' + this.access]);
            }
            else if(this.access == null){
              this.snackBar.open('Something went wrong!', '', {duration: 2000})
            }
          },
          error: err => {
            console.log(err.error);
          }
        })
      },
      error: (err) => {
        console.log(err.error);
      }
    })
  }
}
