import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArticleDetailPageRoutingModule } from './article-detail-routing.module';

import { ArticleDetailPage } from './article-detail.page';
import { ArticleSharedModule } from '../article-shared/article-shared.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArticleDetailPageRoutingModule,
    ArticleSharedModule,
    PdfViewerModule,
    NgxDocViewerModule
  ],
  providers: [PreviewAnyFile],
  declarations: [ArticleDetailPage]
})
export class ArticleDetailPageModule {}
