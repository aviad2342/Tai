import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonInput, IonSearchbar } from '@ionic/angular';
import { Address } from '../../address.model';
import { AddressService } from '../../address.service';

@Component({
  selector: 'app-address-details-picker',
  templateUrl: './address-details-picker.component.html',
  styleUrls: ['./address-details-picker.component.scss'],
})
export class AddressDetailsPickerComponent implements OnInit, AfterViewInit {

  @Output() addressPicked = new EventEmitter<Address>();
  @ViewChild('countryInput') country: IonInput;
  @ViewChild('countriesInput') countries: IonSearchbar;
  valus: string[] = ['bla', 'nana', 'aba', 'kaka', 'sata', 'vava', 'rara'];

  constructor( private addressService: AddressService ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.country.getInputElement().then(countryInput => {
      countryInput.setAttribute('list', 'browsers');
      countryInput.setAttribute('autocomplete', 'on');
    });

    this.countries.getInputElement().then(countryInput => {
      countryInput.setAttribute('list', 'browsers');
      countryInput.setAttribute('autocomplete', 'on');
    });
}

}
