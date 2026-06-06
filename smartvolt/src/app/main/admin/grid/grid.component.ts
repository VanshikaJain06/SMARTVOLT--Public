import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  page_title: any;
  pages: any;
  open_req: any;
  accepted_req: any;
  completed_req: any;
  obj: any;
  access: any;
  user_info: any;
  requests: any;
  companies: any;
  stations: any;

  constructor(private dataService: DataService, private fb: FormBuilder, private http: HttpClient, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.page_title = 'Grid Management'
    this.pages = [true, false]

    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      this.user_info = Object.values(data)[1][0]
    })

    this.refreshRequests()
  }

  refreshRequests() {
    this.open_req = 0
    this.accepted_req = 0
    this.completed_req = 0

    this.http.get('http://localhost:9000/adminAllRequests')
    .subscribe({
      next: (data: any) => {
        this.requests = data[0];
        this.companies = data[1];
        this.stations = data[2];
        this.obj.requests = this.requests;
        this.obj.companies = this.companies;
        this.obj.stations = this.stations;
        this.dataService.update(this.obj)

        this.setAnalytics()
      },
      error: (err: any) => {
        console.log(err.error.error);
      }
    })
  }

  setAnalytics()
  {
      var len = Object.values(this.requests).length
      for(let i = 0; i < len; i += 1){
        if(this.requests[i].request_status == "open"){
          this.open_req += 1;
        }
        else if(this.requests[i].request_status == "accepted"){
          this.accepted_req += 1;
        }
        else if(this.requests[i].request_status == "completed"){
          this.completed_req += 1;
        }
      }
  }

  viewRequests(){
    this.page_title = 'Requests'
    this.pages = [false, true]
  }

  back(){
    this.page_title = 'Grid Management'
    this.pages = [true, false]
    this.refreshRequests();
  }

  delete(req: any){
    if(confirm("Are you sure you want to cancel request id: " + req.request_id + "?")){
      this.http.post('http://localhost:9000/adminDeleteRequest', {"id": req.request_id, "status": req.request_status})
      .subscribe({
        next: (data) => {
          this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
          this.page_title = 'Requests'
          this.pages = [false, true]
          this.refreshRequests()
        },
        error: (err) => {
          this.snackBar.open(err.error.error.message, '', {duration: 2000})
          console.log(err.error.error)
        }
      })
    }
  }
}
