import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class VaccineAppointmentService {
  BASE_URL="https://cdn-api.co-vin.in/api/v2/admin/location";
  BASE_URL_SLOTS = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public"
  constructor(private http: HttpClient) {}

  getAvailSlots() {
    return this.http.get(
      'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=442605&date=11-05-2021'
    );
  }

  getAvailSlotsByPinCode(pinCode,date){
    return this.http.get(this.BASE_URL_SLOTS+"/calendarByPin?pincode="+pinCode+"&date="+date);
  }

  getAvailSlotsByDistrict(districtId,date){
    return this.http.get(this.BASE_URL_SLOTS+"/calendarByDistrict?district_id="+districtId+"&date="+date);
  }

  getStateList(){
    return this.http.get('https://cdn-api.co-vin.in/api/v2/admin/location/states');
  }

  populateDistrictForStateIds(stateId){
    return this.http.get(this.BASE_URL+"/districts/"+stateId);
  }
}
