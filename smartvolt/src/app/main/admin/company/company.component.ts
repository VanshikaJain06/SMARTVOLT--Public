import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  companyForm: any
  page_title: any
  pages: any
  obj: any
  access: any
  user_info: any

  companies: any
  com_id: any

  constructor(private fb: FormBuilder, private http: HttpClient, private dataService: DataService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.page_title = 'Companies'
    this.pages = [true, false, false]

    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      this.user_info = Object.values(data)[1][0]
    })

    this.refreshCompanies()

    this.companyForm =this.fb.group({
      com_name: ['', [Validators.required]],
      com_phone: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      com_email: ['', [Validators.required, Validators.email]],
      com_address: ['', [Validators.required]],
      com_credits: ['', [Validators.required, Validators.max(999)]],
    })
  }

  refreshCompanies() {
    this.http.get('http://localhost:9000/allCompanies')
    .subscribe({
      next: (data) => {
        this.companies = data;
        this.obj.companies = data
        this.dataService.update(this.obj)
      },
      error: (err) => {
        console.log(err.error.error);
      }
    })
  }

  addCompany(){
    this.page_title = 'Add Company'
    this.pages = [false, true, false]

    this.companyForm.get('com_name').setValue('')
    this.companyForm.get('com_phone').setValue('')
    this.companyForm.get('com_email').setValue('')
    this.companyForm.get('com_address').setValue('')
    this.companyForm.get('com_credits').setValue('')
  }

  update(com_id: string){
    this.page_title = 'Update Company'
    this.pages = [false, false, true]

    this.http.get('http://localhost:9000/company', {params: {"id": com_id}})
    .subscribe({
      next: (data) => {
        this.com_id = Object.values(data)[0].com_id
        this.companyForm.get('com_name').setValue(Object.values(data)[0].com_name)
        this.companyForm.get('com_phone').setValue(Object.values(data)[0].com_phone)
        this.companyForm.get('com_email').setValue(Object.values(data)[0].com_email)
        this.companyForm.get('com_address').setValue(Object.values(data)[0].com_address)
        this.companyForm.get('com_credits').setValue(Object.values(data)[0].com_credits)
      },
      error: (err) => {
        this.snackBar.open(err.error.error.message, '', {duration: 2000})
        console.log(err.error.error);
      }
    })
  }

  delete(com_id: string){
    if(confirm("Are you sure you want to delete company id: " + com_id + "?")){
      this.http.post('http://localhost:9000/deleteCompany', {"id": com_id})
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

  confirmCompany(com_info: string){
    this.http.post('http://localhost:9000/addCompany', com_info)
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

  updateCompany(com_info: any){
    com_info.com_id = this.com_id
    this.http.post('http://localhost:9000/updateCompany', com_info)
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
    this.page_title = 'Companies'
    this.pages = [true, false, false]
    this.refreshCompanies()
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

