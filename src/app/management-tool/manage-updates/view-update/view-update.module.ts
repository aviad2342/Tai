import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewUpdatePageRoutingModule } from './view-update-routing.module';

import { ViewUpdatePage } from './view-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewUpdatePageRoutingModule
  ],
  declarations: [ViewUpdatePage]
})
export class ViewUpdatePageModule {}
