import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewEventPageRoutingModule } from './view-event-routing.module';

import { ViewEventPage } from './view-event.page';
import { SharedModule } from '../../../shared/shared.module';
import { EventSharedModule } from '../../../event/event-shared/event-shared.module';
import { ViewParticipantComponent } from '../view-participant/view-participant.component';
import { ViewSpeakerComponent } from '../view-speaker/view-speaker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewEventPageRoutingModule,
    SharedModule,
    EventSharedModule
  ],
  declarations: [ViewEventPage, ViewParticipantComponent, ViewSpeakerComponent]
})
export class ViewEventPageModule {}
