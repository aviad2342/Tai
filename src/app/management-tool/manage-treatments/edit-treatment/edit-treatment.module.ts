import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTreatmentPageRoutingModule } from './edit-treatment-routing.module';

import { EditTreatmentPage } from './edit-treatment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditTreatmentPageRoutingModule
  ],
  declarations: [EditTreatmentPage]
})
export class EditTreatmentPageModule {}
