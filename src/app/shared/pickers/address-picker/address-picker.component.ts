import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AddressService } from '../../address.service';
import { Address } from '../../address.model';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-address-picker',
  templateUrl: './address-picker.component.html',
  styleUrls: ['./address-picker.component.scss'],
})
export class AddressPickerComponent implements OnInit {

  @Output() addressPicked = new EventEmitter<Address>();
  autocompleteItems: string[];

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
    this.addressService.getCountries().subscribe(countries => {
     this.countriesList = this.countries = countries;
    });

    this.addressService.getCities().subscribe(cities => {
      this.citiesList = this.cities = cities;
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
    if (!this.cities) {
      return;
    }
    if (citySearchTerm.length > 0) {
      return this.addressService.getCitiesPrediction(citySearchTerm).subscribe(cities => {
        this.citiesList = cities;
      });
    } else {
      this.citiesList = this.cities;
    }
    // this.citiesList = this.cities.filter(cities => cities.startsWith(citySearchTerm));
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
    this.selectCountry = event.value;
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
    this.selectCity = event.value;
    this.showStreetsList = true;
    this.addressService.getCityStreets(this.selectCity).subscribe(streets => {
      this.streetsList = this.streets = streets;
    });
  }

  selectStreetResult(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.selectstreet = event.value;
  }

}
