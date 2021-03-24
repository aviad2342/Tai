import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageVideosPageRoutingModule } from './manage-videos-routing.module';

import { ManageVideosPage } from './manage-videos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageVideosPageRoutingModule
  ],
  declarations: [ManageVideosPage]
})
export class ManageVideosPageModule {}
