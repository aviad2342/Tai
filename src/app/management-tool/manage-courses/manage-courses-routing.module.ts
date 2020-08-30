import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageCoursesPage } from './manage-courses.page';

const routes: Routes = [
  {
    path: '',
    component: ManageCoursesPage
  },
  {
    path: 'new',
    loadChildren: () => import('./add-course/add-course.module').then( m => m.AddCoursePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageCoursesPageRoutingModule {}
