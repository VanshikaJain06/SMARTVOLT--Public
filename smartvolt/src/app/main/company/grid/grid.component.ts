import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  open_req: any
  completed_req: any
  accepted_req: any
  open_res: any
  accepted_res: any
  completed_res: any
  page_title: any;
  pages: any;
  obj: any;
  access: any;
  com_info: any;
  requests: any;
  resolves: any;
  requestForm: any;
  stations: any;
  req_id: any
  resolveForm: any;
  companies: any;
  otherStations: any;
  timeslots: any;

  constructor(private dataService: DataService, private fb: FormBuilder, private http: HttpClient,  public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.page_title = 'Grid Management'
    this.pages = [true, false, false, false, false, false]

    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      this.com_info = Object.values(data)[1][0]
    })

    this.http.get('http://localhost:9000/timeSlots')
    .subscribe({
      next: (data) => {
        this.timeslots = data
      },
      error: (err) => {
        console.log(err.error.error);
      }
    })

    this.refreshRequests()

    this.requestForm = this.fb.group({
      com_id: [this.com_info.com_id, [Validators.required]],
      station_id: ['', [Validators.required]],
      request_time: [''],
      request_status: ['submitted'],
      curr_station_supply: ['', [Validators.required]],
      requested_supply: ['', [Validators.required, Validators.max(999)]],
    })

    this.resolveForm = this.fb.group({
      request_id: ['', [Validators.required]],
      response_from: ['C' + this.com_info.com_id, [Validators.required]],
      response_time: [''],
      response_supply: ['', [Validators.required]],
      slot_from: ['', [Validators.required]],
      slot_to: ['', [Validators.required]],
    })
  }

  //grid dashboard
  refreshRequests() {
    this.open_req = 0
    this.accepted_req = 0
    this.completed_req = 0
    this.open_res = 0
    this.accepted_res = 0
    this.completed_res = 0

    this.http.get('http://localhost:9000/allRequests', {params: {"id": this.com_info.com_id}})
    .subscribe({
      next: (data: any) => {
        this.requests = data[0];
        this.resolves = data[1];
        this.companies = data[2];
        this.otherStations = data[3];
        this.obj.requests = this.requests;
        this.obj.resolves = this.resolves;
        this.obj.companies = this.companies;
        this.obj.otherStations = this.otherStations;
        this.dataService.update(this.obj)

        this.setAnalytics()
      },
      error: (err: any) => {
        console.log(err.error.error);
      }
    })

    this.http.get('http://localhost:9000/companyStation', {params: {"id": this.com_info.com_id}})
    .subscribe({
      next: (data) => {
        this.stations = data;
        this.obj.stations = data
        this.dataService.update(this.obj)
      },
      error: (err) => {
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
    var len = Object.values(this.resolves).length
    for(let i = 0; i < len; i += 1){
      if(this.resolves[i].request_status == "open"){
        this.open_res += 1;
      }
      else if(this.resolves[i].request_status == "accepted"){
        this.accepted_res += 1;
      }
      else if(this.resolves[i].request_status == "completed"){
        this.completed_res += 1;
      }
    }
  }

  viewRequests(){
    this.page_title = 'Requests'
    this.pages = [false, true, false, false, false, false]
  }

  viewResolves(){
    this.page_title = 'Resolve'
    this.pages = [false, false, false, false, true, false]
  }

  back(){
    this.page_title = 'Grid Management'
    this.pages = [true, false, false, false, false, false]
    this.refreshRequests();
  }

  //all requests
  makeRequest(){
    this.page_title = 'Make Request'
    this.pages = [false, false, true, false, false, false]

    this.req_id = ''
    this.requestForm.get("station_id").setValue('')
    this.requestForm.get("curr_station_supply").setValue('')
    this.requestForm.get("requested_supply").setValue('')
    this.requestForm.get("request_status").setValue('')
  }

  update(req: any){
    this.page_title = 'Update Request'
    this.pages = [false, false, false, true]

    this.req_id = req.request_id
    this.requestForm.get("station_id").setValue(req.station_id)
    this.requestForm.get("curr_station_supply").setValue(req.curr_station_supply)
    this.requestForm.get("requested_supply").setValue(req.requested_supply)
    this.requestForm.get("request_status").setValue(req.request_status)
  }

  delete(req_id: any){
    if(confirm("Are you sure you want to cancel request id: " + req_id + "?")){
      this.http.post('http://localhost:9000/deleteRequest', {"id": req_id})
      .subscribe({
        next: (data) => {
          this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
          this.page_title = 'Requests'
          this.pages = [false, true, false, false, false, false]
          this.refreshRequests()
        },
        error: (err) => {
          this.snackBar.open(err.error.error.message, '', {duration: 2000})
          console.log(err.error.error)
        }
      })
    }
  }

  //make request/ update request
  setStation(station_id: any){
    for(let i = 0; i < this.stations.length; i += 1){
      if(this.stations[i].station_id == station_id){
        var curr_supply  = 0
        var curr_evses = this.stations[i].station_evse
        for(let j = 0; j < curr_evses.length; j += 1){
          curr_supply  += (curr_evses[j].evse.evse_port1.port_powersupply + curr_evses[j].evse.evse_port2.port_powersupply)
        }
        this.requestForm.get("curr_station_supply").setValue(curr_supply)
        break
      }
    }
  }

  confirmReq(req_info: any){
    this.http.post('http://localhost:9000/addRequest', req_info)
      .subscribe({
        next: (data) => {
          this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
          this.page_title = 'Requests'
          this.pages = [false, true, false, false, false, false]
          this.refreshRequests()
        },
        error: (err) => {
          this.snackBar.open(err.error.error.message, '', {duration: 2000})
          console.log(err.error.error)
        }
      })
  }

  updateReq(req_info: any){
    req_info.request_id = this.req_id
    this.http.post('http://localhost:9000/updateRequest', req_info)
      .subscribe({
        next: (data) => {
          this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
          this.page_title = 'Requests'
          this.pages = [false, true, false, false, false, false]
          this.refreshRequests()
        },
        error: (err) => {
          this.snackBar.open(err.error.error.message, '', {duration: 2000})
          console.log(err.error.error)
        }
      })
  }

  cancelReq(){
    this.page_title = 'Requests'
    this.pages = [false, true, false, false, false, false]
    this.refreshRequests()
  }

  //all resolves
  accept(req: any){
    this.page_title = 'Resolve Now'
    this.pages = [false, false, false, false, false, true]

    this.req_id = req.request_id
    this.resolveForm.get('request_id').setValue(req.request_id)
    this.resolveForm.get('response_supply').setValue(req.requested_supply)
  }

  complete(req_id: any){
    if(confirm("Are you sure you want to complete request id: " + req_id + "?")){
      this.http.post('http://localhost:9000/completeRequest', {"id": req_id})
      .subscribe({
        next: (data) => {
          this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
          this.page_title = 'Resolve'
          this.pages = [false, false, false, false, true, false]
          this.refreshRequests()
        },
        error: (err) => {
          this.snackBar.open(err.error.error.message, '', {duration: 2000})
          console.log(err.error.error)
        }
      })
    }
  }

  confirmRes(res_info: any){
    this.http.post('http://localhost:9000/acceptRequest', res_info)
      .subscribe({
        next: (data) => {
          this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
          this.page_title = 'Resolve'
          this.pages = [false, false, false, false, true, false]
          this.refreshRequests()
        },
        error: (err) => {
          this.snackBar.open(err.error.error.message, '', {duration: 2000})
          console.log(err.error.error)
        }
      })
  }

  cancelRes(){
    this.page_title = 'Resolve'
    this.pages = [false, false, false, false, true, false]
    this.refreshRequests()
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

}
