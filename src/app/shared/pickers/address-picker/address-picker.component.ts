import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, ViewChild } from '@angular/core';
import { AddressService } from '../../address.service';
import { Address } from '../../address.model';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { User } from 'src/app/user/user.model';

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
  autocompleteItems: string[];

  country: string;
  city: string;
  street: string;
  houseNumber = 3;
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

  showCitiesList = false;
  showStreetsList = false;

  constructor(private addressService: AddressService) { }

  ngOnInit() {

    if (this.isEdit) {
     // this.houseNumber = this.userAddress.houseNumber;
      this.apartment = this.userAddress.apartment;
      this.entry = this.userAddress.entry;
      console.log(this.userAddress);
    }

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
      }
      });

  }

  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('port:', event.value);
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
      console.log(countries);
    });
  }
  }

  selectCountryResult(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.selectedAddress.country = this.selectCountry = event.value;
    this.showCitiesList = true;
  }

  reSetStreetList() {
    this.selectstreet = '';
    this.showStreetsList = false;
  }

  async selectCitiesResult(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    if (!event.value) {
      return;
    }
    this.selectedAddress.city = this.selectCity = event.value;
    this.showStreetsList = true;
    this.addressService.getCityStreets(this.selectCity).subscribe(streets => {
      this.streetsList = this.streets = streets;
      if (this.isEdit) {
        this.street = this.userAddress.street;
      }
    });
  }

  selectStreetResult(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.selectedAddress.street = this.selectstreet = event.value;
  }

  onHouseNumberChosen(event: any) {
    if (event.target.value) {
    this.selectedAddress.houseNumber = event.target.value;
    this.addressPicked.emit(this.selectedAddress);
    }
  }

}
