import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})
export class StationsComponent implements OnInit {
  obj: any;
  access: any;
  com_info: any;
  stations: any;
  curr_station: any;
  station_count: any = 0;
  evses: any;

  constructor(private dataService: DataService, private http: HttpClient) { }

  ngOnInit(): void {
    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      this.com_info = Object.values(data)[1][0]
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
    if(this.stations[0] != null){
      this.curr_station = this.stations[this.station_count]
    }
  }

  next_station(){
    this.station_count = (this.station_count += 1) % Object.values(this.stations).length
    this.initialize()
  }

  prev_station(){
    this.station_count = Math.abs((this.station_count -= 1)) % Object.values(this.stations).length
    this.initialize()
  }
}
