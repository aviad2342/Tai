import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, ViewChild } from '@angular/core';
import { AddressService } from '../../address.service';
import { Address } from '../../address.model';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { User } from 'src/app/user/user.model';
import { PickerController, IonInput } from '@ionic/angular';

@Component({
  selector: 'app-address-picker',
  templateUrl: './address-picker.component.html',
  styleUrls: ['./address-picker.component.scss'],
})
export class AddressPickerComponent implements OnInit {

  @ViewChild('selectableCountriesComponent') countriesPickerRef: IonicSelectableComponent;
  @ViewChild('selectableCitiesComponent') citiesPickerRef: IonicSelectableComponent;
  @ViewChild('selectableStreetComponent') StreetPickerRef: IonicSelectableComponent;
  @Output() addressPicked = new EventEmitter<Address>();
  @Input() isEdit = false;
  @Input() userAddress = new Address();
  selectedAddress: Address = new Address();
  rangeArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8];

  country: string;
  city: string;
  street: string;
  houseNumber: string;
  apartment: string;
  entry: string;

  countriesAutocomplete = '';
  citiesAutocomplete = '';

  countries: string[];
  countriesList: string[];

  cities: string[];
  citiesList: string[];

  streets: string[];
  streetsList: string[];

  selectCountry: string;
  selectCity: string;
  selectstreet: string;

  showpickers = true;

  constructor(private addressService: AddressService, private pickerController: PickerController) { }

  ngOnInit() {

    this.addressService.getCountries().subscribe(countries => {
      this.countriesList = this.countries = countries;
      if (this.isEdit) {
        this.country = this.userAddress.country;
      }
     });

    this.addressService.getCities().subscribe(cities => {
       this.citiesList = this.cities = cities;
       if (this.isEdit) {
        this.city = this.userAddress.city;
        this.getStreetsListByCity(this.city);
        this.street = this.userAddress.street;
      }
      });

    if (this.isEdit) {
         this.showpickers = false;
         this.houseNumber = this.userAddress.houseNumber;
         this.apartment = this.userAddress.apartment;
         this.entry = this.userAddress.entry;
         this.selectedAddress = this.userAddress;
         this.addressPicked.emit(this.selectedAddress);
       }

  }


  async updateSearchCountriesResults(evt) {
    const countrySearchTerm = evt.text;
    this.countriesList = this.countries.filter(countries => countries.startsWith(countrySearchTerm));
  }

  async updateSearchCitiesResults(evt) {
    const citySearchTerm = evt.text;
    this.citiesList = this.cities.filter(cities => cities.startsWith(citySearchTerm));
  }

  async updateSearchStreetsResults(evt) {
    const StreetSearchTerm = evt.text;
    if (!this.streets) {
      return;
    }
    this.streetsList = this.streets.filter(cities => cities.startsWith(StreetSearchTerm));
  }


  getCountriesAutoComplete(country: string) {
    if (country.length > 0) {
    return this.addressService.getCountriesPrediction(country).subscribe(countries => {
      this.countries = countries;
    });
  }
  }

  selectCountryResult(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    // this.selectedAddress.country = this.selectCountry = event.value;
    this.selectedAddress.country = event.value;
    this.addressPicked.emit(this.selectedAddress);
  }

  async selectCitiesResult(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    if (!event.value) {
      return;
    }
    // this.selectedAddress.city = this.selectCity = event.value;
    this.selectedAddress.city = event.value;
    this.addressPicked.emit(this.selectedAddress);
    this.getStreetsListByCity(event.value);
  }

  async getStreetsListByCity(city: string) {
    this.addressService.getCityStreets(city).subscribe(streets => {
      this.streetsList = this.streets = streets;
    });
  }

  selectStreetResult(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    // this.selectedAddress.street = this.selectstreet = event.value;
    this.selectedAddress.street = event.value;
    this.addressPicked.emit(this.selectedAddress);
    this.enablePickers();
  }

  onHouseNumberChosen(event: any) {
    if (event.target.value) {
    this.selectedAddress.houseNumber = event.target.value;
    this.addressPicked.emit(this.selectedAddress);
    }
  }

  onApartmentChosen(event: any) {
    if (event.target.value) {
    this.selectedAddress.apartment = event.target.value;
    this.addressPicked.emit(this.selectedAddress);
    }
  }

  onEntryChosen(event: any) {
    if (event.target.value) {
    this.selectedAddress.entry = event.target.value;
    this.addressPicked.emit(this.selectedAddress);
    }
  }
  getColumnOptions() {
    const options = [];
    for (let i = 0; i < 280; i++) {
      options.push({
        text: i,
        value: i,
        selected: false
      });
    }
    return options;
  }


async openPicker(input: string) {
    const picker = await this.pickerController.create({
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      columns: [{
        name: 'Number',
        options: this.getColumnOptions()
      }],
     // input: {input: Number},
      buttons: [
        {
          text: 'ביטול',
          role: 'cancel',
          cssClass: 'ion-text-capitalize'
        },
        {
          text: 'אישור',
          cssClass: 'ion-text-capitalize',
          handler: (value: any) => {
            switch (input) {
              case 'houseNumber':
                this.selectedAddress.houseNumber = value.Number.value;
                this.addressPicked.emit(this.selectedAddress);
                console.log(value);
                break;
              case 'apartment':
                this.selectedAddress.apartment = value.Number.value;
                this.addressPicked.emit(this.selectedAddress);
                break;
              case 'entry':
                this.selectedAddress.entry = value.Number.value;
                this.addressPicked.emit(this.selectedAddress);
                break;
              default:
                break;
            }
          }
        }
      ]
    });
    await picker.present();
    // picker.getColumn()
    // picker.addEventListener('ionPickerColChange', async (event: any) => {
    //   // event.detail.options = this.getColumncOptions(10);
    //  // picker.present();
    //   console.log(event);
    //   console.log(event.detail.selectedIndex);
    //   console.log(event.detail.options[9]);
    //   event.detail.selectedIndex = event.detail.selectedIndex + 25;
    // });
  }

  disablPickers() {
    this.showpickers = true;
    this.selectedAddress.houseNumber = '';
    this.selectedAddress.apartment = '';
    this.selectedAddress.entry = '';
  }
  enablePickers() {
    this.showpickers = false;
  }

}
