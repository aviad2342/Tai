import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTestimonyPage } from './edit-testimony.page';

const routes: Routes = [
  {
    path: '',
    component: EditTestimonyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditTestimonyPageRoutingModule {}
