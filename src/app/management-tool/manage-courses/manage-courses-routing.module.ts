import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageCoursesPage } from './manage-courses.page';

const routes: Routes = [
  {
    path: '',
    component: ManageCoursesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageCoursesPageRoutingModule {}
