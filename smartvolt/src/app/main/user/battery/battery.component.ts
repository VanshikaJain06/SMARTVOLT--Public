import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.css']
})
export class BatteryComponent implements OnInit {

  obj: any;
  access: any;
  user_info: any;
  evBats: any;
  curr_evBat: any;
  bat_count: any = 0

  constructor(private dataService: DataService, private http: HttpClient) { }

  ngOnInit(): void {
    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      this.user_info = Object.values(data)[1][0]
    })

    this.http.get('http://localhost:9000/userEVBatteries', {params: {"id": this.user_info.user_id}})
    .subscribe({
      next: (data) => {
        this.evBats = Object.values(data)
        this.obj.evBats = this.evBats
        this.dataService.update(this.obj)
        this.initialize()
      },
      error: (err) => {
        console.log(err.error);
      }
    })
  }

  initialize(){
    if(this.evBats[0] != null){
      this.curr_evBat = this.evBats[this.bat_count]
    }
  }

  next_bat(){
    this.bat_count = (this.bat_count += 1) % Object.values(this.evBats).length
    this.initialize()
  }

  prev_bat(){
    this.bat_count = Math.abs((this.bat_count -= 1)) % Object.values(this.evBats).length
    this.initialize()
  }

}
