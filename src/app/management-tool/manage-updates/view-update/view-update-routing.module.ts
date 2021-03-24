import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewUpdatePage } from './view-update.page';

const routes: Routes = [
  {
    path: '',
    component: ViewUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewUpdatePageRoutingModule {}
