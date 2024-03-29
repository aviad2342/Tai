import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { AutoCompleteComponent } from '@syncfusion/ej2-angular-dropdowns';
import { AddressService } from '../../address.service';
import { DeliveryAddress } from '../../address.model';
import { DomSanitizer } from '@angular/platform-browser';

export interface PickerColumnOption {
  text?: any;
  value?: any;
  selected?: boolean;
}


@Component({
  selector: 'app-address-finder',
  templateUrl: './address-finder.component.html',
  styleUrls: ['./address-finder.component.scss'],
})
export class AddressFinderComponent implements OnInit {

  @Output() addressPicked = new EventEmitter<DeliveryAddress>();
  @Output() isValid = new EventEmitter<boolean>();

  @ViewChild('cityInput') cities: AutoCompleteComponent;
  @ViewChild('streetInput') streets: AutoCompleteComponent;

  @Input() selectedAddress: DeliveryAddress = new DeliveryAddress();
  @Input() isEdit = false;

  @ViewChild('zipel', {read: ElementRef}) zip: ElementRef;

  selectedHouseNumberIndex = 0;
  selectedApartmentIndex = 0;

  houseNumber = Array.from(Array(401).keys());
  apartment = Array.from(Array(50).keys());

  houseNumberPickerOptions: PickerColumnOption[] = [];
  apartmentPickerOptions: PickerColumnOption[] = [];

  enableStreetPicker = false;
  disableHouseNumberPicker = true;

  demo;
  constructor(
    private addressService: AddressService,
    private pickerController: PickerController
     ) { }

  ngOnInit() {
    this.selectedAddress.country = 'ישראל';

    if(this.isEdit) {
      this.enableStreetPicker = true;
      this.disableHouseNumberPicker = false;
    }
    this.houseNumber.splice(0, 1);
    this.houseNumber.forEach(element => {
      this.houseNumberPickerOptions.push({
        text: element,
        value: element,
        selected: false
      });
    });

    this.apartment.splice(0, 1);
    this.apartment.forEach(element => {
      this.apartmentPickerOptions.push({
        text: element,
        value: element,
        selected: false
      });
    });
  }

onSelectedCity(event) {
  this.selectedAddress.city = event.itemData.value;
  this.enableStreetPicker = true;
}

onFilteringCity(event) {
  this.resetAddress();
  this.cities.showSpinner();
  if(event.text !== '') {
    this.addressService.getPostCitiesPrediction(event.text).subscribe(cities => {
      console.log(cities);
      event.updateData(cities);
      this.cities.hideSpinner();
    }, error => {
      console.log(error);
    });
  }
}

onSelectedStreet(event) {
  this.selectedAddress.street = event.itemData.value;
  this.disableHouseNumberPicker = false;
}

onFilteringStreet(event) {
  this.resetHouseNumber();
  if(event.text !== '') {
    this.streets.showSpinner();
    this.addressService.getPostStreetsPrediction( this.selectedAddress.city, event.text).subscribe(streets => {
      event.updateData(streets);
      this.streets.hideSpinner();
    });
  }
}

async onSelecteHouseNumber() {
  if(this.disableHouseNumberPicker) {
    return;
  }
  const picker = await this.pickerController.create({
    animated: true,
    mode: 'ios',
    cssClass: 'house-number-picker',
    backdropDismiss: false,
    columns: [{
      name: 'Number',
      selectedIndex: this.selectedHouseNumberIndex,
      options: this.houseNumberPickerOptions
    }],
    buttons: [
      {
        text: 'ביטול',
        role: 'cancel',
        cssClass: 'house-number-picker-btn'
      },
      {
        text: 'אישור',
        cssClass: 'house-number-picker-btn',
        handler: (value: any) => {
          this.selectedAddress.houseNumber = value.Number.value;
          this.selectedHouseNumberIndex = value.Number.value - 1;
          this.addressPicked.emit(this.selectedAddress);
          this.isValid.emit(true);
          this.addressService.getPostZipCode(this.selectedAddress.city, this.selectedAddress.street, this.selectedAddress.houseNumber)
          .subscribe(zipCode => {
            this.selectedAddress.zipCode = zipCode.match(/RES[0-9]+/)[0].slice(4,11);;
            this.addressPicked.emit(this.selectedAddress);
          });
        }
      }
    ]
  });
  picker.columns[0].options.forEach(element => {
    delete element.selected;
    delete element.duration;
    delete element.transform;
  });
  await picker.present();
}

async onSelecteApartment() {
  if(this.disableHouseNumberPicker) {
    return;
  }
  const picker = await this.pickerController.create({
    animated: true,
    mode: 'ios',
    cssClass: 'house-number-picker',
    backdropDismiss: false,
    columns: [{
      name: 'Number',
      selectedIndex: this.selectedApartmentIndex,
      options: this.apartmentPickerOptions
    }],
    buttons: [
      {
        text: 'ביטול',
        role: 'cancel',
        cssClass: 'house-number-picker-btn'
      },
      {
        text: 'אישור',
        cssClass: 'house-number-picker-btn',
        handler: (value: any) => {
          this.selectedAddress.apartment = value.Number.value;
          this.selectedApartmentIndex = value.Number.value - 1;
          this.addressPicked.emit(this.selectedAddress);
        }
      }
    ]
  });
  picker.columns[0].options.forEach(element => {
    delete element.selected;
    delete element.duration;
    delete element.transform;
  });
  await picker.present();
}

onSelecteEntry(event) {
  this.selectedAddress.entry = event.detail.value;
  this.addressPicked.emit(this.selectedAddress);
}

resetAddress() {
  this.enableStreetPicker = false;
  this.disableHouseNumberPicker = true;
  this.streets.value = '';
  this.selectedAddress.street = '';
  this.selectedAddress.houseNumber = '';
  this.selectedAddress.apartment = '';
  this.selectedAddress.entry = '';
  this.selectedHouseNumberIndex = 0;
  this.selectedApartmentIndex = 0;
}

resetHouseNumber() {
  this.disableHouseNumberPicker = true;
  this.selectedAddress.houseNumber = '';
  this.selectedAddress.apartment = '';
  this.selectedAddress.entry = '';
  this.selectedHouseNumberIndex = 0;
  this.selectedApartmentIndex = 0;
}
}
