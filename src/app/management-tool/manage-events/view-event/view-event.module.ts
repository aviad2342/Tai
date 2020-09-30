import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewEventPageRoutingModule } from './view-event-routing.module';

import { ViewEventPage } from './view-event.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventSharedModule } from 'src/app/event/event-shared/event-shared.module';
// import { SharedModule } from '../../../shared/shared.module';
// import { EventSharedModule } from '../../../event/event-shared/event-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewEventPageRoutingModule,
    SharedModule,
    EventSharedModule
  ],
  declarations: [ViewEventPage]
})
export class ViewEventPageModule {}
