import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  obj: any
  access: any
  com_info:any
  stations: any

  avg_supply: any = 0
  total_stations: any = 0
  act_evse: any = 0
  total_evse: any = 0
  act_ports: any = 0
  total_ports: any = 0
  request_info: any
  request: string = 'Request Supply'

  constructor(private dataService: DataService, private http: HttpClient, public router: Router) { }

  ngOnInit(): void {
    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      try{
        this.com_info = Object.values(data)[1][0]
      }
      catch(err){
        console.log(err);
        this.router.navigate(['../']);
      }
    })

    this.http.get('http://localhost:9000/companyStation', {params: {"id": this.com_info.com_id}})
    .subscribe({
      next: (data) => {
        this.stations = data;
        this.obj.stations = data
        this.dataService.update(this.obj)
        this.initialize()
      },
      error: (err) => {
        console.log(err.error.error);
      }
    })
  }

  initialize(){
    var supply = 0
    this.total_stations = Object.values(this.stations).length
    for(let i = 0; i < this.total_stations; i += 1){
      let evse_count = Object.values(this.stations[i].station_evse).length
      this.total_evse += evse_count
      for(let j = 0; j < evse_count; j += 1){
        let evse = this.stations[i].station_evse[j].evse
        supply += (parseInt(evse.evse_port1.port_powersupply) + parseInt(evse.evse_port2.port_powersupply))
      }
    }
    this.total_ports = this.total_evse * 2
    this.avg_supply = Math.floor(supply / this.total_ports)
  }

}
