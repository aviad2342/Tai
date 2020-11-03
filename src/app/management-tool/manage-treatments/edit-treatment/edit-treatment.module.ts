import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTreatmentPageRoutingModule } from './edit-treatment-routing.module';

import { EditTreatmentPage } from './edit-treatment.page';
import { AddTherapistComponent } from '../add-therapist/add-therapist.component';
import { TherapistSharedModule } from '../therapist-shared/therapist-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditTreatmentPageRoutingModule,
    TherapistSharedModule,
    SharedModule
  ],
  declarations: [EditTreatmentPage]
})
export class EditTreatmentPageModule {}
