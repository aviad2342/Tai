import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Video } from '../../video.model';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.scss'],
})
export class VideoItemComponent implements OnInit {

  @Input() video: Video;
  embedVideo: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer,) { }

  ngOnInit() {
    this.embedVideo = this.sanitizer.bypassSecurityTrustResourceUrl('https://player.vimeo.com/video/'+ this.video.videoId);
  }

}
