import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageTherapistsPageRoutingModule } from './manage-therapists-routing.module';

import { ManageTherapistsPage } from './manage-therapists.page';
import { NgxDatatableModule } from 'projects/swimlane/ngx-datatable/src/public-api';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageTherapistsPageRoutingModule,
    NgxDatatableModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [ManageTherapistsPage]
})
export class ManageTherapistsPageModule {}
