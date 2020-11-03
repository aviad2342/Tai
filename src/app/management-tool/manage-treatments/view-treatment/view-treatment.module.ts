import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTreatmentPageRoutingModule } from './view-treatment-routing.module';

import { ViewTreatmentPage } from './view-treatment.page';
import { TherapistDetailComponent } from '../therapist-detail/therapist-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewTreatmentPageRoutingModule
  ],
  declarations: [ViewTreatmentPage, TherapistDetailComponent]
})
export class ViewTreatmentPageModule {}
