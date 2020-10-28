import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTherapistPageRoutingModule } from './add-therapist-routing.module';

import { AddTherapistPage } from './add-therapist.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTherapistPageRoutingModule,
    SharedModule
  ],
  declarations: [AddTherapistPage]
})
export class AddTherapistPageModule {}
