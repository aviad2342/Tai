import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddArticlePageRoutingModule } from './add-article-routing.module';

import { AddArticlePage } from './add-article.page';
import { SharedModule } from '../../../shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    AddArticlePageRoutingModule,
    SharedModule,
    AngularEditorModule
  ],
  declarations: [AddArticlePage]
})
export class AddArticlePageModule {}
