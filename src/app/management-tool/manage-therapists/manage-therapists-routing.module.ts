import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageTherapistsPage } from './manage-therapists.page';

const routes: Routes = [
  {
    path: '',
    component: ManageTherapistsPage
  },
  {
    path: 'new',
    loadChildren: () => import('./add-therapist/add-therapist.module').then( m => m.AddTherapistPageModule)
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view-therapist/view-therapist.module').then( m => m.ViewTherapistPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit-therapist/edit-therapist.module').then( m => m.EditTherapistPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageTherapistsPageRoutingModule {}
