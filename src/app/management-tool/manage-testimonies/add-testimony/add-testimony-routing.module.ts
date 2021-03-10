import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTestimonyPage } from './add-testimony.page';

const routes: Routes = [
  {
    path: '',
    component: AddTestimonyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTestimonyPageRoutingModule {}
