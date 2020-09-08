import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewLessonPage } from './view-lesson.page';

const routes: Routes = [
  {
    path: '',
    component: ViewLessonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewLessonPageRoutingModule {}
