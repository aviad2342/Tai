import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageCustomersPage } from './manage-customers.page';

const routes: Routes = [
  {
    path: '',
    component: ManageCustomersPage
  },
  {
    path: 'new',
    loadChildren: () => import('./add-customer/add-customer.module').then( m => m.AddCustomerPageModule)
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view-customer/view-customer.module').then( m => m.ViewCustomerPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit-customer/edit-customer.module').then( m => m.EditCustomerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageCustomersPageRoutingModule {}
