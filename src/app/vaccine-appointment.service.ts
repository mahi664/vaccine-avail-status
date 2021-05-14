import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class VaccineAppointmentService {
  constructor(private http: HttpClient) {}

  getAvailSlots() {
    return this.http.get(
      'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=442605&date=11-05-2021'
    );
  }

  getStateList(){
    return this.http.get('https://cdn-api.co-vin.in/api/v2/admin/location/states');
  }
}
