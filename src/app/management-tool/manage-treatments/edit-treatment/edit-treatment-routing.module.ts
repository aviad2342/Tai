import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTreatmentPage } from './edit-treatment.page';

const routes: Routes = [
  {
    path: '',
    component: EditTreatmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditTreatmentPageRoutingModule {}
