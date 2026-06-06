import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  obj: any
  access: any
  user_info: any
  evs: any
  curr_ev: any
  ev_bat: any
  ev_dist: any
  ev_reg_no: any
  ev_count: any = 0

  recommended_station: string = "Cubbon road";
  booking: string = "Charge now";

  constructor(private dataService: DataService, private http: HttpClient, public router: Router) { }

  ngOnInit(): void {
    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      try{
        this.user_info = Object.values(data)[1][0]
      }
      catch(err){
        console.log(err);
        this.router.navigate(['../']);
      }
    })

    this.http.get('http://localhost:9000/userEV', {params: {"id": this.user_info.user_id}})
    .subscribe({
      next: (data) => {
        this.evs = data;
        this.obj.evs = data
        this.dataService.update(this.obj)
        this.initialize()
      },
      error: (err) => {
        console.log(err.error);
      }
    })
  }

  initialize(){
    if(this.evs[0] != null){
      this.curr_ev = this.evs[this.ev_count]
      this.ev_bat = this.curr_ev.battery.remaining_charge
      this.ev_dist = this.curr_ev.battery.estimated_distance
      this.ev_reg_no = this.curr_ev.registration_no
    }
  }

  next_ev(){
    this.ev_count = (this.ev_count += 1) % Object.values(this.evs).length
    this.initialize()
  }

  prev_ev(){
    this.ev_count = Math.abs((this.ev_count -= 1)) % Object.values(this.evs).length
    this.initialize()
  }

}
