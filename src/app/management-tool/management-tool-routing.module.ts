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
  },
  {
    path: 'courses',
    loadChildren: () => import('./manage-courses/manage-courses.module').then( m => m.ManageCoursesPageModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./manage-events/manage-events.module').then( m => m.ManageEventsPageModule)
  },
  {
    path: 'articles',
    loadChildren: () => import('./manage-articles/manage-articles.module').then( m => m.ManageArticlesPageModule)
  },
  {
    path: 'items',
    loadChildren: () => import('./manage-items/manage-items.module').then( m => m.ManageItemsPageModule)
  },
  {
    path: 'therapists',
    loadChildren: () => import('./manage-therapists/manage-therapists.module').then( m => m.ManageTherapistsPageModule)
  },
  {
    path: 'treatments',
    loadChildren: () => import('./manage-treatments/manage-treatments.module').then( m => m.ManageTreatmentsPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./manage-orders/manage-orders.module').then( m => m.ManageOrdersPageModule)
  },
  {
    path: 'customers',
    loadChildren: () => import('./manage-customers/manage-customers.module').then( m => m.ManageCustomersPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementToolPageRoutingModule {}
