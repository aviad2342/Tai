import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTreatmentPage } from './view-treatment.page';

const routes: Routes = [
  {
    path: '',
    component: ViewTreatmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTreatmentPageRoutingModule {}
