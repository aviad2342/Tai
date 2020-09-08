import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewLessonPageRoutingModule } from './view-lesson-routing.module';

import { ViewLessonPage } from './view-lesson.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewLessonPageRoutingModule
  ],
  declarations: [ViewLessonPage]
})
export class ViewLessonPageModule {}
