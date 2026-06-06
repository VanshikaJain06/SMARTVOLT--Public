import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  obj: any;
  access: any;
  user_info: any;
  reports: any;
  filter_name: any

  constructor(private http: HttpClient, private dataService: DataService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.filter_name = ''

    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      this.user_info = Object.values(data)[1][0]
    })

    this.refreshReports()
  }

  refreshReports() {
    this.http.get('http://localhost:9000/allReports')
    .subscribe({
      next: (data) => {
        this.reports = Object.values(data)
        this.obj.reports = this.reports
        this.dataService.update(this.obj)
      },
      error: (err) => {
        console.log(err.error.error);
      }
    })
  }

  update(report_id: any){
    this.http.post('http://localhost:9000/updateReport',{id: report_id})
    .subscribe({
      next: (data) => {
        this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
        this.refreshReports()
      },
      error: (err) => {
        this.snackBar.open(err.error.error.message, '', {duration: 2000})
        console.log(err.error.error);
      }
    })
  }

}
