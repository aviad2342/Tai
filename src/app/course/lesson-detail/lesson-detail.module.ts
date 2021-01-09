import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonDetailPageRoutingModule } from './lesson-detail-routing.module';

import { LessonDetailPage } from './lesson-detail.page';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonDetailPageRoutingModule
  ],
  providers: [YoutubeVideoPlayer],
  declarations: [LessonDetailPage]
})
export class LessonDetailPageModule {}
