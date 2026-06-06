import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data = new BehaviorSubject<object>({})
  currData = this.data.asObservable()

  constructor() { }

  update(newData: object){
    this.data.next(newData)
  }

  formatDate(date: any) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
  }

  // Only Integer Numbers
  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  // Only Alphabets
  keyPressAlpha(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
