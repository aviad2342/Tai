import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArticleDetailPageRoutingModule } from './article-detail-routing.module';

import { ArticleDetailPage } from './article-detail.page';
import { ArticleSharedModule } from '../article-shared/article-shared.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { File } from '@ionic-native/file/ngx/index';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { PdfViewerProvider } from './pdf-viewer.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx/index';




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
  providers: [],
  declarations: [ArticleDetailPage]
})
export class ArticleDetailPageModule {}
