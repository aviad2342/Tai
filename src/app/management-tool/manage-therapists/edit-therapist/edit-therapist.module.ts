import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTherapistPageRoutingModule } from './edit-therapist-routing.module';

import { EditTherapistPage } from './edit-therapist.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditTherapistPageRoutingModule,
    SharedModule
  ],
  declarations: [EditTherapistPage]
})
export class EditTherapistPageModule {}
