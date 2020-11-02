import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTreatmentPage } from './add-treatment.page';

const routes: Routes = [
  {
    path: '',
    component: AddTreatmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTreatmentPageRoutingModule {}
