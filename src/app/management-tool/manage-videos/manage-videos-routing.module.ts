import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageVideosPage } from './manage-videos.page';

const routes: Routes = [
  {
    path: '',
    component: ManageVideosPage
  },
  {
    path: 'new',
    loadChildren: () => import('./add-video/add-video.module').then( m => m.AddVideoPageModule)
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view-video/view-video.module').then( m => m.ViewVideoPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit-video/edit-video.module').then( m => m.EditVideoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageVideosPageRoutingModule {}
