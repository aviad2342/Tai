import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageUsersPageRoutingModule } from './manage-users-routing.module';

import { ManageUsersPage } from './manage-users.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AddUserComponent } from './addd-user/add-user.component';
import { SharedModule } from '../../shared/shared.module';
import { ViewUserComponent } from './vieww-user/view-user.component';
import { EditUserComponent } from './editt-user/edit-user.component';

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
  declarations: [ManageUsersPage, AddUserComponent, ViewUserComponent, EditUserComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ManageUsersPageModule {}
