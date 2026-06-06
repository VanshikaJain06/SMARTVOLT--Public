import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  obj: any
  user_info: any
  access: any
  reportForm: any

  constructor(private dataService: DataService, private fb: FormBuilder, private http: HttpClient, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      this.user_info = Object.values(data)[1][0]
    })

    this.reportForm = this.fb.group({
      report_from: ['U'+this.user_info.user_id, [Validators.required]],
      report_time: ['', [Validators.required]],
      report_status: ['pending', [Validators.required]],
      report_description: ['', [Validators.required]]
    })
  }

  report(issue: string){
    this.reportForm.get('report_description').setValue(issue)
    this.http.post('http://localhost:9000/addReport', this.reportForm.value)
    .subscribe({
      next: (data) => {
        this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
      },
      error: (err) => {
        this.snackBar.open(err.error.error.message, '', {duration: 2000})
        console.log(err.error.error)
      }
    })
  }
}
