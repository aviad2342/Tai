import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageArticlesPageRoutingModule } from './manage-articles-routing.module';

import { ManageArticlesPage } from './manage-articles.page';
import { NgxDatatableModule } from 'projects/swimlane/ngx-datatable/src/public-api';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageArticlesPageRoutingModule,
    NgxDatatableModule,
    SharedModule
  ],
  declarations: [ManageArticlesPage]
})
export class ManageArticlesPageModule {}
