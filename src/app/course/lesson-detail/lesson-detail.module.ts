import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonDetailPageRoutingModule } from './lesson-detail-routing.module';

import { LessonDetailPage } from './lesson-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonDetailPageRoutingModule
  ],
  declarations: [LessonDetailPage]
})
export class LessonDetailPageModule {}
