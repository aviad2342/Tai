import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageItemsPage } from './manage-items.page';

const routes: Routes = [
  {
    path: '',
    component: ManageItemsPage
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view-item/view-item.module').then( m => m.ViewItemsPageModule)
  },
  {
    path: 'new',
    loadChildren: () => import('./add-item/add-item.module').then( m => m.AddItemPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit-item/edit-item.module').then( m => m.EditItemPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageItemsPageRoutingModule {}
