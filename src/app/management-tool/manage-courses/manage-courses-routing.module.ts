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
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit-course/edit-course.module').then( m => m.EditCoursePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageCoursesPageRoutingModule {}
