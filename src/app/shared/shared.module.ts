import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { AddressPickerComponent } from './pickers/address-picker/address-picker.component';

@NgModule({
  declarations: [ImagePickerComponent, AddressPickerComponent],
  imports: [CommonModule, IonicModule],
  exports: [ImagePickerComponent, AddressPickerComponent]
})
export class SharedModule {}
