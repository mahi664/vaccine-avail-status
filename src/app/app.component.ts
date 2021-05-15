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
  districts: any = [];
  topMessage =
    'No need to refresh the page it will notify you once the vaccine is available';

  pinCode = '';
  selectedState = '';
  selectedDistrict = '';
  isSearchByPin = true;
  dateToPass = '';

  constructor(private vaccineService: VaccineAppointmentService) {}
  displaySlots = false;

  ngOnInit() {
    this.createDateToPass();
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
    // console.log(
    //   new Date().getDate() +
    //     '/' +
    //     new Date().getMonth() +
    //     '/' +
    //     new Date().getFullYear() +
    //     ' ' +
    //     new Date().getHours() +
    //     ':' +
    //     new Date().getMinutes() +
    //     ':' +
    //     new Date().getSeconds()
    // );
    // this.vaccineService.getAvailSlots().subscribe(
    //   response => {
    //     this.vaccineSlots = response;
    //     console.log(this.vaccineSlots);
    //     this.processData();
    //   },
    //   error => {
    //     this.errorMessage = 'Error in fetching slots: \n' + error;
    //     this.topMessage = 'Some thing went wrong please try later';
    //   }
    // );
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
        alert(
          'Vaccine Availiable At: ' +
            eachSlot.address +
            ' ' +
            eachSlot.block_name +
            ' ' +
            eachSlot.name +
            ' ' +
            eachSession.available_capacity +
            ' Doses Availiable ' +
            eachSession.date
        );
      }
    }
    this.uiMessages.push(
      '*******************************************************************************************'
    );
  }

  changeSearchBy() {
    this.isSearchByPin = !this.isSearchByPin;
  }

  populateDistricts() {
    // alert("populating districts for "+this.selectedState);
    this.pinCode="";
    this.vaccineService
      .populateDistrictForStateIds(this.selectedState)
      .subscribe(
        response => {
          this.districts = response;
          console.log(this.districts);
        },
        error => {
          console.log('Error in populating districts ' + error);
        }
      );
  }

  fetchAllAvailSlots() {
    if (this.isSearchByPin) {
      this;
      if (this.pinCode === '') {
        alert('Please enter Pin code !');
      } else {
        // alert("Searching for PIN : "+this.pinCode);
        setInterval(() => {
          this.vaccineService
            .getAvailSlotsByPinCode(this.pinCode, this.dateToPass)
            .subscribe(
              response => {
                this.vaccineSlots = response;
                console.log(this.vaccineSlots);
                this.processData();
                this.displaySlots = true;
              },
              error => {
                this.topMessage = 'Something went wrong';
                console.log('Error in fetching slots' + error);
              }
            );
        }, 4000);
      }
    } else {
      if (this.selectedState === '') {
        alert('Please select state !');
      } else if (this.selectedDistrict === '') {
        alert('Please select District !');
      } else {
        // alert(
        //   'Searching for State : ' +
        //     this.selectedState +
        //     ' And District:' +
        //     this.selectedDistrict
        // );
        setInterval(() => {
          this.vaccineService
            .getAvailSlotsByDistrict(this.selectedDistrict, this.dateToPass)
            .subscribe(
              response => {
                this.vaccineSlots = response;
                console.log(this.vaccineSlots);
                this.processData();
                this.displaySlots = true;
              },
              error => {
                this.topMessage = 'Something went wrong';
                console.log('Error in fetching slots' + error);
              }
            );
        }, 4000);
      }
    }
  }

  createDateToPass() {
    let date: Date;
    date = new Date();

    if (date.getDate() < 10)
      this.dateToPass = this.dateToPass + '0' + date.getDate();
    else this.dateToPass = this.dateToPass + date.getDate();

    let month = date.getMonth() + 1;
    if (month < 10) this.dateToPass = this.dateToPass + '-' + '0' + month;
    else this.dateToPass = this.dateToPass + '-' + month;

    this.dateToPass = this.dateToPass + '-' + date.getFullYear();

    console.log('Date to Pass:' + this.dateToPass);
  }
}
