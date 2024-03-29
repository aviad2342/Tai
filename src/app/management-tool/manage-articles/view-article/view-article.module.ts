import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewArticlePageRoutingModule } from './view-article-routing.module';

import { ViewArticlePage } from './view-article.page';
import { ArticleSharedModule } from '../../../article/article-shared/article-shared.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewArticlePageRoutingModule,
    ArticleSharedModule,
    NgxDocViewerModule
  ],
  declarations: [ViewArticlePage]
})
export class ViewArticlePageModule {}
