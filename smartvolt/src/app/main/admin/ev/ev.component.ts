import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: 'app-ev',
  templateUrl: './ev.component.html',
  styleUrls: ['./ev.component.css']
})
export class EvComponent implements OnInit {

  evForm: any
  page_title: any
  pages: any
  info_page: any
  obj: any
  access: any
  user_info: any

  evs: any
  ev_id: any
  batteries: any
  ports: any
  battery: any
  port: any

  constructor(private fb: FormBuilder, private http: HttpClient, private dataService: DataService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.page_title = 'EVs'
    this.pages = [true, false, false]

    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      this.user_info = Object.values(data)[1][0]
    })

    this.refreshEVs()

    this.evForm =this.fb.group({
      ev_name: ['', [Validators.required]],
      ev_model: ['', [Validators.required]],
      ev_company: ['', [Validators.required]],
      ev_type: ['', [Validators.required]],
      ev_mileage: ['', [Validators.required, Validators.max(199)]],
      ev_port: ['', [Validators.required]],
      bat_id: ['', [Validators.required]],
    })
  }

  refreshEVs() {
    this.info_page = [false, false]
    this.http.get('http://localhost:9000/allEVs')
    .subscribe({
      next: (data) => {
        this.evs = Object.values(data)[0]
        this.batteries = Object.values(data)[1]
        this.ports = Object.values(data)[2]

        this.obj.evs = this.evs
        this.obj.batteries = this.batteries
        this.obj.ports = this.ports
        this.dataService.update(this.obj)
      },
      error: (err) => {
        console.log(err.error.error);
      }
    })
  }

  showPort(port_id: any){
    for(let i = 0; i < this.ports.length; i += 1){
      if(this.ports[i].port_id == port_id){
        this.port = this.ports[i]
        this.info_page = [true, false]
        break
      }
    }
  }

  showBattery(bat_id: any){
    for(let i = 0; i < this.batteries.length; i += 1){
      if(this.batteries[i].bat_id ==bat_id){
        this.battery = this.batteries[i]
        this.info_page = [false, true]
        break
      }
    }
  }

  addEV(){
    this.page_title = 'Add EV'
    this.pages = [false, true, false]

    this.evForm.get('ev_name').setValue('')
    this.evForm.get('ev_model').setValue('')
    this.evForm.get('ev_company').setValue('')
    this.evForm.get('ev_type').setValue('')
    this.evForm.get('ev_mileage').setValue('')
    this.evForm.get('ev_port').setValue('')
    this.evForm.get('bat_id').setValue('')
  }

  update(ev_id: string){
    this.page_title = 'Update EV'
    this.pages = [false, false, true]

    this.http.get('http://localhost:9000/ev', {params: {"id": ev_id}})
    .subscribe({
      next: (data) => {
        this.ev_id = Object.values(data)[0].ev_id
        this.evForm.get('ev_name').setValue(Object.values(data)[0].ev_name)
        this.evForm.get('ev_model').setValue(Object.values(data)[0].ev_model)
        this.evForm.get('ev_company').setValue(Object.values(data)[0].ev_company)
        this.evForm.get('ev_type').setValue(Object.values(data)[0].ev_type)
        this.evForm.get('ev_mileage').setValue(Object.values(data)[0].ev_mileage)
        this.evForm.get('ev_port').setValue(Object.values(data)[0].ev_port)
        this.evForm.get('bat_id').setValue(Object.values(data)[0].bat_id)
      },
      error: (err) => {
        this.snackBar.open(err.error.error.message, '', {duration: 2000})
        console.log(err.error.error);
      }
    })
  }

  delete(ev_id: string){
    if(confirm("Are you sure you want to delete EV id: " + ev_id + "?")){
      this.http.post('http://localhost:9000/deleteEV', {"id": ev_id})
      .subscribe({
        next: (data) => {
          this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
          this.page_title = 'EVs'
          this.pages = [true, false, false]
          this.refreshEVs()
        },
        error: (err) => {
          this.snackBar.open(err.error.error.message, '', {duration: 2000})
          console.log(err.error.error)
        }
      })
    }
  }

  confirmEV(ev_info: string){
    this.http.post('http://localhost:9000/addEV', ev_info)
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

  updateEV(ev_info: any){
    ev_info.ev_id = this.ev_id
    this.http.post('http://localhost:9000/updateEV', ev_info)
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
    this.page_title = 'EVs'
    this.pages = [true, false, false]
    this.refreshEVs()
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
