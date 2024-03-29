import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageCoursesPageRoutingModule } from './manage-courses-routing.module';

import { ManageCoursesPage } from './manage-courses.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { AddLessonComponent } from './add-lesson/add-lesson.component';
import { EditLessonComponent } from './edit-lesson/edit-lesson.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageCoursesPageRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ManageCoursesPage, AddLessonComponent, EditLessonComponent]
})
export class ManageCoursesPageModule {}
