import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';
import { IonicSelectableModule } from 'ionic-selectable';

import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { AddressPickerComponent } from './pickers/address-picker/address-picker.component';
import { FormsModule } from '@angular/forms';
import { GalleryComponent } from './gallery/gallery.component';
import { ImageItemComponent } from './image-item/image-item.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NumberPickerComponent } from './pickers/number-picker/number-picker.component';
import { AddressDetailsPickerComponent } from './pickers/address-details-picker/address-details-picker.component';
import { AddressFinderComponent } from './pickers/address-finder/address-finder.component';
import { AddressFormPickerComponent } from './pickers/address-form-picker/address-form-picker.component';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { DateCountdownComponent } from './date-countdown/date-countdown.component';

@NgModule({
  declarations: [
    ImagePickerComponent,
    AddressPickerComponent,
    GalleryComponent,
    ImageItemComponent,
    NumberPickerComponent,
    AddressDetailsPickerComponent,
    AddressFinderComponent,
    AddressFormPickerComponent,
    DateCountdownComponent
  ],
  imports: [
      CommonModule,
      IonicModule,
      IonicSelectableModule,
      FormsModule,
      NgxDropzoneModule,
      AutoCompleteModule,
      NgxIonicImageViewerModule
    ],
  exports: [
    ImagePickerComponent,
    AddressPickerComponent,
    GalleryComponent,
    ImageItemComponent,
    NumberPickerComponent,
    AddressDetailsPickerComponent,
    AddressFinderComponent,
    AddressFormPickerComponent,
    DateCountdownComponent
  ]
})
export class SharedModule {}
