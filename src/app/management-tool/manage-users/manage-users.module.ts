import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageUsersPageRoutingModule } from './manage-users-routing.module';

import { ManageUsersPage } from './manage-users.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageUsersPageRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ManageUsersPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ManageUsersPageModule {}
