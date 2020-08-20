import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagementToolPage } from './management-tool.page';

const routes: Routes = [
  {
    path: '',
    component: ManagementToolPage
  },
  {
    path: 'users',
    loadChildren: () => import('./manage-users/manage-users.module').then( m => m.ManageUsersPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementToolPageRoutingModule {}
