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
  private videosSubscription: Subscription;
  isDesktop: boolean;
  isLoading = false;

  constructor( private videoService: VideoService, private appService: AppService ) { }

  ngOnInit() {
    this.isLoading = true;
    // this.videosSubscription = this.videoService.videos.subscribe(videos => {
    //   this.videos = videos;
    //   this.isLoading = false;
    // }, error => {
    //   this.isLoading = false;
    //   console.log(error);
    // });

    this.videoService.getAllVideos().subscribe(videos => {
      this.videos = videos;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
    // this.videoService.getVideos().subscribe();
  }

  ngOnDestroy() {
    if (this.videosSubscription) {
      this.videosSubscription.unsubscribe();
    }
  }

}
