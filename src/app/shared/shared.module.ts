import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';

import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { AddressPickerComponent } from './pickers/address-picker/address-picker.component';
import { FormsModule } from '@angular/forms';
import { GalleryComponent } from './gallery/gallery.component';
import { ImageItemComponent } from './image-item/image-item.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [ImagePickerComponent, AddressPickerComponent, GalleryComponent, ImageItemComponent],
  imports: [CommonModule, IonicModule, IonicSelectableModule, FormsModule, NgxDropzoneModule],
  exports: [ImagePickerComponent, AddressPickerComponent, GalleryComponent, ImageItemComponent]
})
export class SharedModule {}
