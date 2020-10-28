import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTherapistPage } from './view-therapist.page';

const routes: Routes = [
  {
    path: '',
    component: ViewTherapistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTherapistPageRoutingModule {}
