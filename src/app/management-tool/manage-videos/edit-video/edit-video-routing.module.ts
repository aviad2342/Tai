import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditVideoPage } from './edit-video.page';

const routes: Routes = [
  {
    path: '',
    component: EditVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditVideoPageRoutingModule {}
