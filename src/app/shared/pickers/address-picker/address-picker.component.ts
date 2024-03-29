import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, ViewChild } from '@angular/core';
import { AddressService } from '../../address.service';
import { Address } from '../../address.model';
import { IonicSelectableComponent } from 'ionic-selectable';
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
  @Output() isValid = new EventEmitter<boolean>();
  @Input() isEdit = false;
  @Input() address = new Address();
  selectedAddress: Address = new Address();
  rangeArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8];

  country: string;
  city: string;
  street: string;
  houseNumber: string;
  apartment: string;
  entry: string;
  isLoadingStreets = false;

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
        this.country = this.address.country;
      }
     });

    this.addressService.getCities().subscribe(cities => {
       this.citiesList = this.cities = cities;
       if (this.isEdit) {
        this.city = this.address.city;
        setTimeout(() => {
          this.getStreetsListByCity(this.address?.city);
        });
        this.street = this.address.street;
      }
      });

    if (this.isEdit) {
         this.showpickers = false;
         this.houseNumber = this.address.houseNumber;
         this.apartment = this.address.apartment;
         this.entry = this.address.entry;
         this.selectedAddress = this.address;
         this.addressPicked.emit(this.selectedAddress);
         this.isValid.emit(true);
  } else {
         this.selectedAddress.apartment = '0';
         this.selectedAddress.entry = '0';
         this.isValid.emit(false);
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
    this.isLoadingStreets = true;
    this.addressService.getCityStreets(city).subscribe(streets => {
      this.streetsList = this.streets = streets;
      this.isLoadingStreets = false;
    }, error => {
      console.log(error);
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

  async onStreetSearchFailed(text: string) {
    console.log('noob');
    console.log(text);
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
                this.isValid.emit(true);
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
    picker.columns[0].options.forEach(element => {
      delete element.selected;
      delete element.duration;
      delete element.transform;
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
    this.isValid.emit(false);
    this.showpickers = true;
    this.selectedAddress.houseNumber = '';
    this.selectedAddress.apartment = '0';
    this.selectedAddress.entry = '0';
  }
  enablePickers() {
    this.showpickers = false;
  }

}
