import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventDetailPageRoutingModule } from './event-detail-routing.module';

import { EventDetailPage } from './event-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpeakerItemComponent } from '../speaker-item/speaker-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [EventDetailPage, SpeakerItemComponent]
})
export class EventDetailPageModule {}
