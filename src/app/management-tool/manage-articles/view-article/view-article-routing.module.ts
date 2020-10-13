import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewArticlePage } from './view-article.page';

const routes: Routes = [
  {
    path: '',
    component: ViewArticlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewArticlePageRoutingModule {}
