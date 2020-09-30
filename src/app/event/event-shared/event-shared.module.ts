import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeakerItemComponent } from './speaker-item/speaker-item.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EventDetailPageRoutingModule } from '../event-detail/event-detail-routing.module';



@NgModule({
  declarations: [SpeakerItemComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventDetailPageRoutingModule
  ],
  exports: [SpeakerItemComponent]
})
export class EventSharedModule { }
