import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageArticlesPage } from './manage-articles.page';

const routes: Routes = [
  {
    path: '',
    component: ManageArticlesPage
  },
  {
    path: 'new',
    loadChildren: () => import('./add-article/add-article.module').then( m => m.AddArticlePageModule)
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view-article/view-article.module').then( m => m.ViewArticlePageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit-article/edit-article.module').then( m => m.EditArticlePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageArticlesPageRoutingModule {}
