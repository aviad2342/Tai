import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTreatmentPageRoutingModule } from './add-treatment-routing.module';

import { AddTreatmentPage } from './add-treatment.page';
import { SharedModule } from '../../../shared/shared.module';
import { AddTherapistComponent } from '../add-therapist/add-therapist.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTreatmentPageRoutingModule,
    SharedModule
  ],
  declarations: [AddTreatmentPage, AddTherapistComponent]
})
export class AddTreatmentPageModule {}
