import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTestimonyPageRoutingModule } from './edit-testimony-routing.module';

import { EditTestimonyPage } from './edit-testimony.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditTestimonyPageRoutingModule,
    SharedModule
  ],
  declarations: [EditTestimonyPage]
})
export class EditTestimonyPageModule {}
