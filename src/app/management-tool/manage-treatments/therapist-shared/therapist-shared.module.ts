import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditTreatmentPageRoutingModule } from '../edit-treatment/edit-treatment-routing.module';
import { AddTherapistComponent } from '../add-therapist/add-therapist.component';



@NgModule({
  declarations: [AddTherapistComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditTreatmentPageRoutingModule
  ],
  exports: [AddTherapistComponent]
})
export class TherapistSharedModule { }
