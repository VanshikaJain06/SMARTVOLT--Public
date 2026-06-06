import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userForm: any
  page_title: any
  pages: any
  obj: any
  access: any
  user_info: any

  users: any
  user_id: any

  constructor(private fb: FormBuilder, private http: HttpClient, private dataService: DataService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.page_title = 'Users'
    this.pages = [true, false, false]

    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      this.user_info = Object.values(data)[1][0]
    })

    this.refreshUsers()

    this.userForm =this.fb.group({
      user_firstname: ['', [Validators.required]],
      user_lastname: ['', [Validators.required]],
      user_phone: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      user_email: ['', [Validators.required, Validators.email]],
      user_address: ['', [Validators.required]],
      user_DOB: ['', [Validators.required]],
      user_credits: ['', [Validators.required, Validators.max(999)]],
      user_license: ['', [Validators.required]],
    })
  }

  refreshUsers() {
    this.http.get('http://localhost:9000/allUsers')
    .subscribe({
      next: (data) => {
        this.users = data;
        this.obj.users = data
        this.dataService.update(this.obj)
      },
      error: (err) => {
        console.log(err.error.error);
      }
    })
  }

  addUser(){
    this.page_title = 'Add User'
    this.pages = [false, true, false]

    this.user_id = ''
    this.userForm.get('user_firstname').setValue('')
    this.userForm.get('user_lastname').setValue('')
    this.userForm.get('user_phone').setValue('')
    this.userForm.get('user_email').setValue('')
    this.userForm.get('user_address').setValue('')
    this.userForm.get('user_DOB').setValue('')
    this.userForm.get('user_credits').setValue('')
    this.userForm.get('user_license').setValue('')
  }

  update(user_id: string){
    this.page_title = 'Update User'
    this.pages = [false, false, true]

    this.http.get('http://localhost:9000/user', {params: {"id": user_id}})
    .subscribe({
      next: (data) => {
        this.user_id = Object.values(data)[0].user_id
        this.userForm.get('user_firstname').setValue(Object.values(data)[0].user_firstname)
        this.userForm.get('user_lastname').setValue(Object.values(data)[0].user_lastname)
        this.userForm.get('user_phone').setValue(Object.values(data)[0].user_phone)
        this.userForm.get('user_email').setValue(Object.values(data)[0].user_email)
        this.userForm.get('user_address').setValue(Object.values(data)[0].user_address)
        this.userForm.get('user_DOB').setValue(this.dataService.formatDate(Object.values(data)[0].user_DOB))
        this.userForm.get('user_credits').setValue(Object.values(data)[0].user_credits)
        this.userForm.get('user_license').setValue(Object.values(data)[0].user_license)
      },
      error: (err) => {
        this.snackBar.open(err.error.error.message, '', {duration: 2000})
        console.log(err.error.error);
      }
    })
  }

  delete(user_id: string){
    if(confirm("Are you sure you want to delete user id: " + user_id + "?")){
      this.http.post('http://localhost:9000/deleteUser', {"id": user_id})
      .subscribe({
        next: (data) => {
          this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
          this.cancel()
        },
        error: (err) => {
          this.snackBar.open(err.error.error.message, '', {duration: 2000})
          console.log(err.error.error)
        }
      })
    }
  }

  confirmUser(user_info: any){
    this.http.post('http://localhost:9000/addUser', user_info)
    .subscribe({
      next: (data) => {
        this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
        this.cancel()
      },
      error: (err) => {
        this.snackBar.open(err.error.error.message, '', {duration: 2000})
        console.log(err.error.error)
      }
    })
  }

  updateUser(user_info: any){
    user_info.user_id = this.user_id
    this.http.post('http://localhost:9000/updateUser', user_info)
    .subscribe({
      next: (data) => {
        this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
        this.cancel()
      },
      error: (err) => {
        this.snackBar.open(err.error.error.message, '', {duration: 2000})
        console.log(err.error.error)
      }
    })
  }

  cancel(){
    this.page_title = 'Users'
    this.pages = [true, false, false]
    this.refreshUsers()
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
