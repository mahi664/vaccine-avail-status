import { error } from '@angular/compiler/src/util';
import { Component, VERSION } from '@angular/core';
import { VaccineAppointmentService } from './vaccine-appointment.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  vaccineSlots: any = [];
  uiMessages = [];
  errorMessage;
  states: any = [];
  topMessage = 'Status of ALL vaccine Availiabiltty will be updated here';
  constructor(private vaccineService: VaccineAppointmentService) {}

  ngOnInit() {
    this.states = this.vaccineService.getStateList().subscribe(
      response => {
        this.states = response;
        console.log(this.states);
      },
      error => {
        this.topMessage = 'Something went wront';
        console.log('Error in fetching states' + error);
      }
    );
    // setInterval(() => {
    console.log(
      new Date().getDate() +
        '/' +
        new Date().getMonth() +
        '/' +
        new Date().getFullYear() +
        ' ' +
        new Date().getHours() +
        ':' +
        new Date().getMinutes() +
        ':' +
        new Date().getSeconds()
    );
    this.vaccineService.getAvailSlots().subscribe(
      response => {
        this.vaccineSlots = response;
        console.log(this.vaccineSlots);
        this.processData();
      },
      error => {
        this.errorMessage = 'Error in fetching slots: \n' + error;
        this.topMessage = 'Some thing went wrong please try later';
      }
    );
    // }, 4000);
    // this.vaccineService.getAvailSlots().subscribe(response => {
    //   this.vaccineSlots = response;
    //   console.log(this.vaccineSlots);
    //   this.processData();
    // });
  }

  processData() {
    for (let i = 0; i < this.vaccineSlots.centers.length; i++) {
      let eachSlot = this.vaccineSlots.centers[i];
      for (let j = 0; j < eachSlot.sessions.length; j++) {
        let eachSession = eachSlot.sessions[j];
        // if (eachSession.min_age_limit > 18) {
        //   continue;
        // }
        if (eachSession.available_capacity == 0) {
          this.uiMessages.push(
            'Vaccine Still not Available on ' +
              eachSession.date +
              ' At ' +
              eachSlot.name +
              ' Updated on' +
              new Date()
          );

          continue;
        }
        // this.uiMessages = [];
        this.uiMessages.push(
          'Vaccine Available on ' +
            eachSession.date +
            ' At ' +
            eachSlot.name +
            ' Updated on' +
            new Date()
        );
        // alert(
        //   'Vaccine Availiable At: ' +
        //     eachSlot.address +
        //     ' ' +
        //     eachSlot.block_name +
        //     ' ' +
        //     eachSlot.name +
        //     ' ' +
        //     eachSession.available_capacity +
        //     ' Doses Availiable ' +
        //     eachSession.date
        // );
      }
    }
    this.uiMessages.push(
      '*******************************************************************************************'
    );
  }
}
