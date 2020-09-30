import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventDetailPageRoutingModule } from './event-detail-routing.module';

import { EventDetailPage } from './event-detail.page';
import { SharedModule } from '../../shared/shared.module';
import { EventSharedModule } from '../event-shared/event-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventDetailPageRoutingModule,
    SharedModule,
    EventSharedModule
  ],
  declarations: [EventDetailPage]
})
export class EventDetailPageModule {}
