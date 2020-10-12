import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditEventPageRoutingModule } from './edit-event-routing.module';

import { EditEventPage } from './edit-event.page';
import { SharedModule } from '../../../shared/shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { EditSpeakerComponent } from '../edit-speaker/edit-speaker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditEventPageRoutingModule,
    SharedModule,
    NgxDropzoneModule
  ],
  declarations: [EditEventPage, EditSpeakerComponent]
})
export class EditEventPageModule {}
