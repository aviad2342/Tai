import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCoursePageRoutingModule } from './edit-course-routing.module';

import { EditCoursePage } from './edit-course.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCoursePageRoutingModule,
    SharedModule
  ],
  declarations: [EditCoursePage]
})
export class EditCoursePageModule {}
