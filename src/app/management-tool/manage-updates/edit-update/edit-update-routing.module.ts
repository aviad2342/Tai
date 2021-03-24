import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditUpdatePage } from './edit-update.page';

const routes: Routes = [
  {
    path: '',
    component: EditUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditUpdatePageRoutingModule {}
