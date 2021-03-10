import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageTestimoniesPageRoutingModule } from './manage-testimonies-routing.module';

import { ManageTestimoniesPage } from './manage-testimonies.page';
import { NgxDatatableModule } from 'projects/swimlane/ngx-datatable/src/public-api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageTestimoniesPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [ManageTestimoniesPage]
})
export class ManageTestimoniesPageModule {}
