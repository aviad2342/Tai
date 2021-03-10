import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTestimonyPageRoutingModule } from './add-testimony-routing.module';

import { AddTestimonyPage } from './add-testimony.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTestimonyPageRoutingModule,
    SharedModule
  ],
  declarations: [AddTestimonyPage]
})
export class AddTestimonyPageModule {}
