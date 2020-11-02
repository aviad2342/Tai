import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTreatmentPageRoutingModule } from './view-treatment-routing.module';

import { ViewTreatmentPage } from './view-treatment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewTreatmentPageRoutingModule
  ],
  declarations: [ViewTreatmentPage]
})
export class ViewTreatmentPageModule {}
