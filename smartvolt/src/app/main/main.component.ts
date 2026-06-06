import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { DataService } from '../data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  access: any
  data: any
  user: any
  credits: any
  notAdmin: boolean

  navLinks: any
  materialClasses: any
  curr_time: Date = new Date();

  constructor(private authService: SocialAuthService, public router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.notAdmin = true

    this.dataService.currData.subscribe(data => {
      this.access = Object.values(data)[0]
      try{
        this.data = Object.values(data)[1][0]
      }
      catch(err){
        console.log(err);
        this.router.navigate(['../']);
      }

      if(this.access == 'admin'){
        this.user = this.data.admin_name
        this.navLinks = ['Dashboard', 'Grid', 'User', 'Company', 'EV', 'EVSE', 'Reports']
        this.materialClasses = ['space_dashboard', 'grid_on', 'account_circle', 'work', 'electric_car', 'ev_station', 'report']
        this.notAdmin = false
      }
      else if(this.access == 'user'){
        this.user = this.data.user_firstname + " " + this.data.user_lastname
        this.credits = this.data.user_credits
        this.navLinks = ['Dashboard', 'Map', 'Booking', 'EVs', 'Battery', 'Support']
        this.materialClasses = ['space_dashboard', 'explore', 'pending_actions', 'electric_car', 'timelapse', 'support']
      }
      else if(this.access == 'company'){
        this.user = this.data.com_name
        this.credits = this.data.com_credits
        this.navLinks = ['Dashboard', 'Map', 'Grid', 'Stations', 'Support']
        this.materialClasses = ['space_dashboard', 'explore', 'grid_on', 'ev_station', 'support']
      }
    })
  }

  async logout(): Promise<void> {
    if(confirm("Are you sure you want to logout?")){
      await this.authService.signOut();
      this.dataService.update({});
      this.router.navigate(['']);
    }
  }
}
