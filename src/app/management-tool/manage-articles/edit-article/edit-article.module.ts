import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditArticlePageRoutingModule } from './edit-article-routing.module';

import { EditArticlePage } from './edit-article.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditArticlePageRoutingModule,
    SharedModule,
    AngularEditorModule
  ],
  declarations: [EditArticlePage]
})
export class EditArticlePageModule {}
