import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursePage } from './course.page';

const routes: Routes = [
  {
    path: '',
    component: CoursePage
  },
  {
    path: ':id',
    loadChildren: () => import('./course-detail/course-detail.module').then( m => m.CourseDetailPageModule)
  },
  {
    path: 'lesson/:id',
    loadChildren: () => import('./lesson-detail/lesson-detail.module').then( m => m.LessonDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursePageRoutingModule {}
