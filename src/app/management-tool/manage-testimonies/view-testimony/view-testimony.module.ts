import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTestimonyPageRoutingModule } from './view-testimony-routing.module';

import { ViewTestimonyPage } from './view-testimony.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewTestimonyPageRoutingModule
  ],
  declarations: [ViewTestimonyPage]
})
export class ViewTestimonyPageModule {}
