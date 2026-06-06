import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: 'app-evse',
  templateUrl: './evse.component.html',
  styleUrls: ['./evse.component.css']
})
export class EvseComponent implements OnInit {

  evseForm: any
  page_title: any
  info_page: any
  pages: any
  obj: any
  access: any
  user_info: any

  evses: any
  evse_id: any
  ports: any
  port: any

  constructor(private fb: FormBuilder, private http: HttpClient, private dataService: DataService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.page_title = 'EVSEs'
    this.pages = [true, false, false]

    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      this.user_info = Object.values(data)[1][0]
    })

    this.refreshEVSEs()

    this.evseForm =this.fb.group({
      evse_name: ['', [Validators.required]],
      evse_model: ['', [Validators.required]],
      evse_company: ['', [Validators.required]],
      evse_port1: ['', [Validators.required]],
      evse_port2: ['', [Validators.required]],
    })
  }

  refreshEVSEs() {
    this.info_page = false
    this.http.get('http://localhost:9000/allEVSEs')
    .subscribe({
      next: (data) => {
        this.evses = Object.values(data)[0]
        this.ports = Object.values(data)[1]

        this.obj.evses = this.evses
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
        this.info_page = true
        break
      }
    }
  }

  addEVSE(){
    this.page_title = 'Add EVSE'
    this.pages = [false, true, false]

    this.evseForm.get('evse_name').setValue('')
    this.evseForm.get('evse_model').setValue('')
    this.evseForm.get('evse_company').setValue('')
    this.evseForm.get('evse_port1').setValue('')
    this.evseForm.get('evse_port2').setValue('')
  }

  update(evse_id: string){
    this.page_title = 'Update EVSE'
    this.pages = [false, false, true]

    this.http.get('http://localhost:9000/evse', {params: {"id": evse_id}})
    .subscribe({
      next: (data) => {
        this.evse_id = Object.values(data)[0].evse_id
        this.evseForm.get('evse_name').setValue(Object.values(data)[0].evse_name)
        this.evseForm.get('evse_model').setValue(Object.values(data)[0].evse_model)
        this.evseForm.get('evse_company').setValue(Object.values(data)[0].evse_company)
        this.evseForm.get('evse_port1').setValue(Object.values(data)[0].evse_port1)
        this.evseForm.get('evse_port2').setValue(Object.values(data)[0].evse_port2)
      },
      error: (err) => {
        this.snackBar.open(err.error.error.message, '', {duration: 2000})
        console.log(err.error.error);
      }
    })
  }

  delete(evse_id: string){
    if(confirm("Are you sure you want to delete EVSE id: " + evse_id + "?")){
      this.http.post('http://localhost:9000/deleteEVSE', {"id": evse_id})
      .subscribe({
        next: (data) => {
          this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
          this.page_title = 'EVSEs'
          this.pages = [true, false, false]
          this.refreshEVSEs()
        },
        error: (err) => {
          this.snackBar.open(err.error.error.message, '', {duration: 2000})
          console.log(err.error.error)
        }
      })
    }
  }

  confirmEVSE(evse_info: string){
    this.http.post('http://localhost:9000/addEVSE', evse_info)
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

  updateEVSE(evse_info: any){
    evse_info.evse_id = this.evse_id
    this.http.post('http://localhost:9000/updateEVSE', evse_info)
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
    this.page_title = 'EVSEs'
    this.pages = [true, false, false]
    this.refreshEVSEs()
  }

  keyPressAlpha(event: any) {
    return this.dataService.keyPressAlpha(event)
  }
}

