import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AddressService } from '../../address.service';
import { Address } from '../../address.model';

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

  countries: string[] = [];
  cities: string[] = [];

  selectCountry: string;
  selectCity: string;

  hideCitiesList = false;
  hideCountriesList = false;

  constructor(private addressService: AddressService) { }

  ngOnInit() {}

  async updateSearchCountriesResults(evt) {
    const countrySearchTerm = evt.srcElement.value;
    console.log(countrySearchTerm);
    if (!countrySearchTerm) {
      this.hideCountriesList = true;
      return;
    }
    this.hideCountriesList = false;
    this.getCountriesAutoComplete(countrySearchTerm);
  }

  updateSearchCitiesResults(evt) {
    const citySearchTerm = evt.srcElement.value;
    console.log(citySearchTerm);
    if (!citySearchTerm) {
      this.hideCountriesList = true;
      return;
    }
    this.hideCountriesList = false;
    this.getCountriesAutoComplete(citySearchTerm);
  }


  getCountriesAutoComplete(country: string) {
    if (country.length > 0) {
    return this.addressService.getCities(country).subscribe(countries => {
      this.countries = countries;
      console.log(countries);
    });
  }
  }

  selectCountryResult(country) {
    this.selectCountry = country;
    this.countriesAutocomplete = this.selectCountry;
    this.hideCountriesList = true;
  }

  selectCitiesResult(city) {
    this.selectCountry = city;
    this.countriesAutocomplete = this.selectCountry;
    this.hideCountriesList = true;
  }

}
