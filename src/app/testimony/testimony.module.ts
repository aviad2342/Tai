import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestimonyPageRoutingModule } from './testimony-routing.module';

import { TestimonyPage } from './testimony.page';
import { TestimonyItemComponent } from './testimony-item/testimony-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestimonyPageRoutingModule
  ],
  declarations: [TestimonyPage, TestimonyItemComponent]
})
export class TestimonyPageModule {}
