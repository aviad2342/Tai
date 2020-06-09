import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';

import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { AddressPickerComponent } from './pickers/address-picker/address-picker.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ImagePickerComponent, AddressPickerComponent],
  imports: [CommonModule, IonicModule, IonicSelectableModule, FormsModule],
  exports: [ImagePickerComponent, AddressPickerComponent]
})
export class SharedModule {}
