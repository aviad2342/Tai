import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageUpdatesPageRoutingModule } from './manage-updates-routing.module';

import { ManageUpdatesPage } from './manage-updates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageUpdatesPageRoutingModule
  ],
  declarations: [ManageUpdatesPage]
})
export class ManageUpdatesPageModule {}
