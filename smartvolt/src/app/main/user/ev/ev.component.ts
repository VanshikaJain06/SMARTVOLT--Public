import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-ev',
  templateUrl: './ev.component.html',
  styleUrls: ['./ev.component.css']
})
export class EvComponent implements OnInit {

  obj: any;
  access: any;
  user_info: any;
  evs: any;
  curr_ev: any;
  ev_count: any = 0

  constructor(private dataService: DataService, private http: HttpClient) { }

  ngOnInit(): void {
    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      this.user_info = Object.values(data)[1][0]
    })

    this.http.get('http://localhost:9000/userEVs', {params: {"id": this.user_info.user_id}})
    .subscribe({
      next: (data) => {
        this.evs = Object.values(data)
        console.log(data);

        this.obj.userEvs = this.evs
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

