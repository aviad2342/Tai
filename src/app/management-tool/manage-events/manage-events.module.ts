import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageEventsPageRoutingModule } from './manage-events-routing.module';

import { ManageEventsPage } from './manage-events.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageEventsPageRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ManageEventsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ManageEventsPageModule {}
