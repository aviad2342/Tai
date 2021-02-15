import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonDetailPageRoutingModule } from './lesson-detail-routing.module';

import { LessonDetailPage } from './lesson-detail.page';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { VimeModule } from '@vime/angular';
import { VideoPlayer } from '@ionic-native/video-player/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonDetailPageRoutingModule,
    VimeModule
  ],
  providers: [YoutubeVideoPlayer, VideoPlayer],
  declarations: [LessonDetailPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LessonDetailPageModule {}
