import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticlePage } from './article.page';

const routes: Routes = [
  {
    path: '',
    component: ArticlePage
  },
  {
    path: 'new',
    loadChildren: () => import('./new-article/new-article.module').then( m => m.NewArticlePageModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./article-detail/article-detail.module').then( m => m.ArticleDetailPageModule)
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
export class ArticlePageRoutingModule {}
