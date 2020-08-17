import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseDetailPageRoutingModule } from './course-detail-routing.module';

import { CourseDetailPage } from './course-detail.page';
import { LessonItemComponent } from '../lesson-item/lesson-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseDetailPageRoutingModule
  ],
  declarations: [CourseDetailPage, LessonItemComponent]
})
export class CourseDetailPageModule {}
