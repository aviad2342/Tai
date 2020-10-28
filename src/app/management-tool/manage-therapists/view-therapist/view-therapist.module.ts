import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTherapistPageRoutingModule } from './view-therapist-routing.module';

import { ViewTherapistPage } from './view-therapist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewTherapistPageRoutingModule
  ],
  declarations: [ViewTherapistPage]
})
export class ViewTherapistPageModule {}
