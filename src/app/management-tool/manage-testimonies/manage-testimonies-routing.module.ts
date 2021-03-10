import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageTestimoniesPage } from './manage-testimonies.page';

const routes: Routes = [
  {
    path: '',
    component: ManageTestimoniesPage
  },
  {
    path: 'new',
    loadChildren: () => import('./add-testimony/add-testimony.module').then( m => m.AddTestimonyPageModule)
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view-testimony/view-testimony.module').then( m => m.ViewTestimonyPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit-testimony/edit-testimony.module').then( m => m.EditTestimonyPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageTestimoniesPageRoutingModule {}
