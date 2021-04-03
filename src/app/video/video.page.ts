import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { Video } from './video.model';
import { VideoService } from './video.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit, OnDestroy  {

  videos: Video[];
  savedVideos: string[] = [];
  private videosSubscription: Subscription;
  isDesktop: boolean;
  isLoading = false;

  constructor( private videoService: VideoService, private appService: AppService ) { }

  ngOnInit() {
    this.isLoading = true;
    this.videosSubscription = this.videoService.videos.subscribe(videos => {
      this.videos = videos;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
    this.videoService.getSavedVideos().subscribe(videos => {
      if(videos) {
        this.savedVideos = [...videos.videos];
        console.log(this.savedVideos);
      }
    });
  }

  isSaved(id: string) {
    return this.savedVideos.includes(id);
  }

  onSaveVideoItem(videoId: string) {
    this.savedVideos.push(videoId);
    console.log(this.savedVideos);
  }

  onRemoveSavedVideoItem(videoId: string) {
    this.savedVideos.splice(this.savedVideos.indexOf(videoId),1);
    console.log(this.savedVideos);
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
    this.videoService.getVideos().subscribe();
  }

  ionViewDidLeave() {
    console.log('dd');
    this.videoService.storeSavedVideosData(this.savedVideos);
  }

  ngOnDestroy() {
    if (this.videosSubscription) {
      this.videosSubscription.unsubscribe();
    }
  }

}
