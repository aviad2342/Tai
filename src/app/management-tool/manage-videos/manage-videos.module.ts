import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageVideosPageRoutingModule } from './manage-videos-routing.module';

import { ManageVideosPage } from './manage-videos.page';
import { NgxDatatableModule } from 'projects/swimlane/ngx-datatable/src/public-api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageVideosPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [ManageVideosPage]
})
export class ManageVideosPageModule {}
