import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagementToolPageRoutingModule } from './management-tool-routing.module';

import { ManagementToolPage } from './management-tool.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagementToolPageRoutingModule
  ],
  declarations: [ManagementToolPage]
})
export class ManagementToolPageModule {}
