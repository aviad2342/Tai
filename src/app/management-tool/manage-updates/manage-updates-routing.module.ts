import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageUpdatesPage } from './manage-updates.page';

const routes: Routes = [
  {
    path: '',
    component: ManageUpdatesPage
  },
  {
    path: 'new',
    loadChildren: () => import('./add-update/add-update.module').then( m => m.AddUpdatePageModule)
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view-update/view-update.module').then( m => m.ViewUpdatePageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit-update/edit-update.module').then( m => m.EditUpdatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageUpdatesPageRoutingModule {}
