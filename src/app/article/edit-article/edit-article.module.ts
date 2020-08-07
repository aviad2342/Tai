import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditArticlePageRoutingModule } from './edit-article-routing.module';

import { EditArticlePage } from './edit-article.page';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditArticlePageRoutingModule,
    QuillModule,
    SharedModule
  ],
  declarations: [EditArticlePage]
})
export class EditArticlePageModule {}
