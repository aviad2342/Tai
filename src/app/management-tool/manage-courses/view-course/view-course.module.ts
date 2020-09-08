import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewCoursePageRoutingModule } from './view-course-routing.module';

import { ViewCoursePage } from './view-course.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewCoursePageRoutingModule
  ],
  declarations: [ViewCoursePage]
})
export class ViewCoursePageModule {}
