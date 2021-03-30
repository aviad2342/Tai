import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoItemComponent } from './video-item/video-item.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [VideoItemComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [VideoItemComponent]
})
export class VideoSharedModule { }
