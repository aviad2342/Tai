import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddUpdatePageRoutingModule } from './add-update-routing.module';

import { AddUpdatePage } from './add-update.page';
import { UpdateItemComponent } from '../update-item/update-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddUpdatePageRoutingModule
  ],
  declarations: [AddUpdatePage, UpdateItemComponent]
})
export class AddUpdatePageModule {}
