import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTherapistPage } from './add-therapist.page';

const routes: Routes = [
  {
    path: '',
    component: AddTherapistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTherapistPageRoutingModule {}
