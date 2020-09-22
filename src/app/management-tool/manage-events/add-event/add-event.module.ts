import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEventPageRoutingModule } from './add-event-routing.module';

import { AddEventPage } from './add-event.page';
import { SharedModule } from '../../../shared/shared.module';
import { AddSpeakerComponent } from '../add-speaker/add-speaker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEventPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [AddEventPage, AddSpeakerComponent]
})
export class AddEventPageModule {}
