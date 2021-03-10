import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTestimonyPage } from './view-testimony.page';

const routes: Routes = [
  {
    path: '',
    component: ViewTestimonyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTestimonyPageRoutingModule {}
