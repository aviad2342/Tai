import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageEventsPage } from './manage-events.page';

const routes: Routes = [
  {
    path: '',
    component: ManageEventsPage
  },
  {
    path: 'new',
    loadChildren: () => import('./add-event/add-event.module').then( m => m.AddEventPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit-event/edit-event.module').then( m => m.EditEventPageModule)
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view-event/view-event.module').then( m => m.ViewEventPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageEventsPageRoutingModule {}
