import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageOrdersPage } from './manage-orders.page';

const routes: Routes = [
  {
    path: '',
    component: ManageOrdersPage
  },
  {
    path: 'new',
    loadChildren: () => import('./add-order/add-order.module').then( m => m.AddOrderPageModule)
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view-order/view-order.module').then( m => m.ViewOrderPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit-order/edit-order.module').then( m => m.EditOrderPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageOrdersPageRoutingModule {}
