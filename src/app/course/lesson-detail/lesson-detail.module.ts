import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonDetailPageRoutingModule } from './lesson-detail-routing.module';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { LessonDetailPage } from './lesson-detail.page';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonDetailPageRoutingModule
  ],
  providers: [YoutubeVideoPlayer, StreamingMedia],
  declarations: [LessonDetailPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LessonDetailPageModule {}
