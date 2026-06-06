
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {  FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  access: any;
  welcome: string
  pages: any
  email: string
  userRegistrationForm: any
  companyRegistrationForm: any

  constructor(private fb: FormBuilder, public router: Router, private http: HttpClient, private dataService: DataService, public snackBar: MatSnackBar) {  }

  ngOnInit(): void {
    this.welcome = 'Register'
    this.pages = [true, false, false]

    this.dataService.currData.subscribe(data => {
      this.email = Object.values(data).toString()
    })

    this.userRegistrationForm =this.fb.group({
      user_firstname: ['', [Validators.required]],
      user_lastname: ['', [Validators.required]],
      user_phone: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      user_email: [this.email, [Validators.required, Validators.email]],
      user_address: ['', [Validators.required]],
      user_DOB: ['', [Validators.required]],
      user_credits: [100],
      user_license: ['', [Validators.required]],
    })

    this.companyRegistrationForm =this.fb.group({
      com_name: ['', [Validators.required]],
      com_phone: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      com_email: [this.email, [Validators.required, Validators.email]],
      com_address: ['', [Validators.required]],
      com_credits: [100],
    })
  }

  iAmUser(user:string){
    this.access = user
    this.welcome = 'Hello ' + this.access + '!'
    this.pages = [false, true, false]
  }

  iAmCompany(user:string){
    this.access = user
    this.welcome = 'Hello ' + this.access + '!'
    this.pages = [false, false, true]
  }

  register(user_info: object){
    let payload: object = {access: this.access, data: user_info}

    this.http.post<object>('http://localhost:9000/register', payload)
    .subscribe({
      next: () => {
        this.http.get("http://localhost:9000/auth", {params: {"email": this.email}})
        .subscribe({
          next: data => {
            this.dataService.update(data)
            alert("User registered successfully!");
            this.router.navigate(['/main/' + this.access + '/Dashboard']);
          },
          error: err => {
            console.log(err.error);
          }
        });
      },
      error: err => {
        console.log(err.error);
        this.snackBar.open(err.error.error.message, '', {duration: 2000})
      }
    })
  }

  //validations
  validate(invalid: any, message: any){
    if(invalid){
      this.snackBar.open(message, '', {duration: 2000})
    }
  }
  keyPressNumbers(event: any) {
    return this.dataService.keyPressNumbers(event)
  }
  keyPressAlpha(event: any) {
    return this.dataService.keyPressAlpha(event)
  }
}
