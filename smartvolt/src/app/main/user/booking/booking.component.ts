import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  page_title: string
  pages: any
  obj: any
  access: any
  user_info: any
  evs: any
  stations: any
  timeslots: any
  station_evses: any
  booking_id: any

  bookings: any
  bookingForm: any

  constructor(private dataService: DataService, private fb: FormBuilder, private http: HttpClient, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.page_title = 'Bookings'
    this.pages = [true, false, false]

    this.dataService.currData.subscribe(data => {
      this.obj = data
      this.access = Object.values(data)[0]
      this.user_info = Object.values(data)[1][0]
      this.evs = Object.values(data)[2]
    })

    this.refreshBookings()

    this.http.get('http://localhost:9000/timeSlots')
    .subscribe({
      next: (data) => {
        this.timeslots = data
      },
      error: (err) => {
        console.log(err.error.error);
      }
    })

    this.bookingForm =this.fb.group({
      user_id: [''],
      user_ev_id: ['', [Validators.required]],
      station_evse_id: ['', [Validators.required]],
      booking_status: [''],
      booking_time: [''],
      slot_from: ['', [Validators.required]],
      slot_to: ['', [Validators.required]],
      transaction_id: [''],
      user_bat_charge: ['', [Validators.required]],
      user_location: [''],
      station_id: '',
    })
  }

  refreshBookings() {
    this.http.get('http://localhost:9000/allBookings', {params: {"id": this.user_info.user_id}})
    .subscribe({
      next: (data) => {
        this.bookings = data;
        this.obj.bookings = data
        this.dataService.update(this.obj)
      },
      error: (err) => {
        console.log(err.error.error);
      }
    })

    this.http.get('http://localhost:9000/stationNames')
    .subscribe({
      next: (data) => {
        this.stations = data
      },
      error: (err) => {
        console.log(err.error.error);
      }
    })
  }

  setUserEV(ev_id: Event){
    this.bookingForm.user_ev_id = ev_id
    for(let i = 0; i < this.evs.length; i += 1){
      if(this.evs[i].user_ev_id == ev_id){
        this.bookingForm.get('user_bat_charge').setValue(this.evs[i].battery.remaining_charge)
        break
      }
    }
  }

  setStation(station_id: Event){
    for(let i = 0; i < this.stations.length; i += 1){
      if(this.stations[i].station_id == station_id){
        this.station_evses = this.stations[i].station_evses
        break
      }
    }
  }

  bookNow(){
    this.page_title = 'Book Now'
    this.pages = [false, true, false]

    this.booking_id = ''
    this.bookingForm.get('user_id').setValue(this.user_info.user_id)
    this.bookingForm.get('user_ev_id').setValue('')
    this.bookingForm.get('station_evse_id').setValue('')
    this.bookingForm.get('booking_status').setValue('pending')
    this.bookingForm.get('booking_time').setValue('')
    this.bookingForm.get('slot_from').setValue('')
    this.bookingForm.get('slot_to').setValue('')
    this.bookingForm.get('transaction_id').setValue('')
    this.bookingForm.get('user_bat_charge').setValue('')
    this.bookingForm.get('user_location').setValue('latitude.longitude')
    this.bookingForm.get('station_id').setValue('')
  }

  update(booking_id: string){
    this.page_title = 'Update Booking'
    this.pages = [false, false, true]

    this.http.get('http://localhost:9000/booking', {params: {"id": booking_id}})
    .subscribe({
      next: (data) => {
        this.booking_id = Object.values(data)[0].booking_id
        this.bookingForm.get('user_id').setValue(Object.values(data)[0].user_id)
        this.bookingForm.get('user_ev_id').setValue(Object.values(data)[0].user_ev_id)
        this.bookingForm.get('station_evse_id').setValue(Object.values(data)[0].station_evse_id)
        this.bookingForm.get('booking_status').setValue(Object.values(data)[0].booking_status)
        this.bookingForm.get('booking_time').setValue(Object.values(data)[0].booking_time)
        this.bookingForm.get('slot_from').setValue(Object.values(data)[0].slot_from)
        this.bookingForm.get('slot_to').setValue(Object.values(data)[0].slot_to)
        this.bookingForm.get('transaction_id').setValue(Object.values(data)[0].transaction_id)
        this.bookingForm.get('user_bat_charge').setValue(Object.values(data)[0].user_bat_charge)
        this.bookingForm.get('user_location').setValue(Object.values(data)[0].user_location)
        this.bookingForm.get('station_id').setValue(Object.values(data)[0].station.station_id)
      },
      error: (err) => {
        this.snackBar.open(err.error.error.message, '', {duration: 2000})
        console.log(err.error.error);
      }
    })
  }

  complete(booking_id: string){
    if(confirm("Are you sure you want to complete booking id: " + booking_id + "?")){
      this.http.post('http://localhost:9000/completeBooking', {"id": booking_id})
      .subscribe({
        next: (data) => {
          this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
          this.page_title = 'Bookings'
          this.pages = [true, false, false]
          this.refreshBookings()
        },
        error: (err) => {
          this.snackBar.open(err.error.error.message, '', {duration: 2000})
          console.log(err.error.error)
        }
      })
    }
  }
  delete(booking_id: string){
    if(confirm("Are you sure you want to cancel booking id: " + booking_id + "?")){
      this.http.post('http://localhost:9000/deleteBooking', {"id": booking_id})
      .subscribe({
        next: (data) => {
          this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
          this.page_title = 'Bookings'
          this.pages = [true, false, false]
          this.refreshBookings()
        },
        error: (err) => {
          this.snackBar.open(err.error.error.message, '', {duration: 2000})
          console.log(err.error.error)
        }
      })
    }
  }

  confirmBooking(booking_info: any){
    delete booking_info.station_id
    this.http.post('http://localhost:9000/addBooking', booking_info)
    .subscribe({
      next: (data) => {
        this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
        this.page_title = 'Bookings'
        this.pages = [true, false, false]
        this.refreshBookings()
      },
      error: (err) => {
        this.snackBar.open(err.error.error.message, '', {duration: 2000})
        console.log(err.error.error)
      }
    })
  }

  updateBooking(booking_info: any){
    booking_info.booking_id = this.booking_id
    delete booking_info.station_id
    this.http.post('http://localhost:9000/updateBooking', booking_info)
    .subscribe({
      next: (data) => {
        this.snackBar.open(Object.values(data)[0], '', {duration: 2000})
        this.page_title = 'Bookings'
        this.pages = [true, false, false]
        this.refreshBookings()
      },
      error: (err) => {
        this.snackBar.open(err.error.error.message, '', {duration: 2000})
        console.log(err.error.error)
      }
    })
  }

  cancel(){
    this.page_title = 'Bookings'
    this.pages = [true, false, false]
    this.refreshBookings()
  }
}
