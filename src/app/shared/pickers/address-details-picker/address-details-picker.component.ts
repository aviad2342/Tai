import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonInput, IonSearchbar } from '@ionic/angular';
import { AutoCompleteComponent } from '@syncfusion/ej2-angular-dropdowns';
import { Address } from '../../address.model';
import { AddressService } from '../../address.service';
import { Query, DataManager,Predicate } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-address-details-picker',
  templateUrl: './address-details-picker.component.html',
  styleUrls: ['./address-details-picker.component.scss'],
})
export class AddressDetailsPickerComponent implements OnInit, AfterViewInit {

  @Output() addressPicked = new EventEmitter<Address>();
  @ViewChild('countryInput') country: IonInput;
  @ViewChild('countriesInput') countries: IonSearchbar;
  @ViewChild('cityInput') cities: AutoCompleteComponent;
  citySearch = '';
  valus: string[] = [];
  selectedCity = '';
  localFields = '';
  public fields: object = {};
  public citiesPrediction: string[] = [];


  constructor( private addressService: AddressService ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.country.getInputElement().then(countryInput => {
    //   countryInput.setAttribute('list', 'browsers');
    //   countryInput.setAttribute('autocomplete', 'on');
    // });

    // this.countries.getInputElement().then(countryInput => {
    //   countryInput.setAttribute('list', 'browsers');
    //   countryInput.setAttribute('autocomplete', 'on');
    // });
}

onChange(event) {
  console.log(event);
}

onFiltering(event) {
  console.log(event.text);
  if(event.text !== '') {
    this.addressService.getCitiesPrediction(event.text).subscribe(cities => {
      console.log(cities);
      this.citiesPrediction = cities;
      this.citiesPrediction.push('');
      this.cities.dataSource = this.citiesPrediction;
      this.cities.showPopup();
      this.cities.dataBind();
    });
  }
}

getCountryPrediction(event) {
  // console.log(event);
  // console.log(this.cities.select);
  // console.log(this.selectedCity);
  // if(this.citySearch !== '') {
  //   this.addressService.getCitiesPrediction(this.citySearch).subscribe(cities => {
  //     console.log(cities);
  //     this.citiesPrediction = cities;
  //   });
  // }
}

}
