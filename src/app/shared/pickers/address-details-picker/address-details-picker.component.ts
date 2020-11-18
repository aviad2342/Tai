import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IonInput, IonSearchbar, PickerController } from '@ionic/angular';
import { AutoCompleteComponent } from '@syncfusion/ej2-angular-dropdowns';
import { Address } from '../../address.model';
import { AddressService } from '../../address.service';
import { Query, DataManager,Predicate } from '@syncfusion/ej2-data';
import { Observable, Subscription } from 'rxjs';

export interface PickerColumnOption {
  text?: any;
  value?: any;
  selected?: boolean;
}

@Component({
  selector: 'app-address-details-picker',
  templateUrl: './address-details-picker.component.html',
  styleUrls: ['./address-details-picker.component.scss'],
})
export class AddressDetailsPickerComponent implements OnInit {

  @Output() addressPicked = new EventEmitter<Address>();
  @Output() isValid = new EventEmitter<boolean>();
  @ViewChild('countryInput') country: IonInput;
  @ViewChild('countriesInput') countries: IonSearchbar;
  @ViewChild('cityInput') cities: AutoCompleteComponent;
  selectedAddress: Address = new Address();
  houseNumber = Array.from(Array(401).keys());
  citiesData: string[];
  citySearch = '';
  selectedCity = '';
  selectedIndex = 0;
  pickerOptions: PickerColumnOption[] = [];

  constructor(
    private addressService: AddressService,
    private pickerController: PickerController
     ) { }

  ngOnInit() {
    this.houseNumber.splice(0, 1);
    this.houseNumber.forEach(element => {
      this.pickerOptions.push({
        text: element,
        value: element,
        selected: false
      });
    });
  }


onSelectedCity(event) {
  this.selectedAddress.city = event.itemData.value;
}

onFilteringCity(event) {
  this.selectedCity = event.text;
  if(event.text !== '') {
    this.addressService.getCitiesPrediction(event.text).subscribe(cities => {
      // (this.cities.dataSource as any) = this.citiesPrediction;
      // this.cities.dataBind();
      event.updateData(cities);
      // const keyEventArgs: any = { preventDefault: (): void => { }, action: 'down', keyCode: 40, type: null };
      // (this.cities as any).onFilterUp(keyEventArgs);
      // (this.cities as any).popupObj.element.classList.add('event-suggestion');
      // console.log(cities);
      // this.citiesPrediction = cities;
      // this.citiesPrediction.push('');
      // this.cities.dataSource = this.citiesPrediction;
      // this.cities.showPopup();
      // this.cities.dataBind();
    });
  }
}

onSelectedStreet(event) {
  this.selectedAddress.street = event.itemData.value;
  this.selectedCity = event.itemData.value;
  console.log(event.itemData.value);
}

onFilteringStreet(event) {
  this.selectedCity = event.text;
  if(event.text !== '') {
    this.addressService.getStreetsPrediction( this.selectedCity, event.text).subscribe(cities => {
      event.updateData(cities);
    });
  }
}

async onSelecteHouseNumber() {
  const picker = await this.pickerController.create({
    animated: true,
    mode: 'ios',
    backdropDismiss: false,
    columns: [{
      name: 'Number',
      selectedIndex: this.selectedIndex,
      options: this.pickerOptions
    }],
   // input: {input: Number},
    buttons: [
      {
        text: 'ביטול',
        role: 'cancel',
        cssClass: 'ion-text-capitalize'
      },
      {
        text: '+100',
        role: 'sort',
        cssClass: 'ion-text-capitalize',
        handler: (value: any) => {
          this.selectedIndex = value.Number.value + 100;
        }
      },
      {
        text: 'אישור',
        cssClass: 'ion-text-capitalize',
        handler: (value: any) => {
          this.selectedAddress.houseNumber = value.Number.value;
          this.addressPicked.emit(this.selectedAddress);
          this.isValid.emit(true);
        }
      }
    ]
  });
  await picker.present();
}


}
