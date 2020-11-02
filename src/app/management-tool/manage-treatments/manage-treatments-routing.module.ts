import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageTreatmentsPage } from './manage-treatments.page';

const routes: Routes = [
  {
    path: '',
    component: ManageTreatmentsPage
  },
  {
    path: 'new',
    loadChildren: () => import('./add-treatment/add-treatment.module').then( m => m.AddTreatmentPageModule)
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view-treatment/view-treatment.module').then( m => m.ViewTreatmentPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit-treatment/edit-treatment.module').then( m => m.EditTreatmentPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageTreatmentsPageRoutingModule {}
