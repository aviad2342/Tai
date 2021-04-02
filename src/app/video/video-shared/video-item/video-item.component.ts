import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Video } from '../../video.model';
import { VideoService } from '../../video.service';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.scss'],
})
export class VideoItemComponent implements OnInit {

  @Input() video: Video;
  @Input() saved = false;
  embedVideo: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer, private videoService: VideoService) { }

  ngOnInit() {
    this.embedVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this?.video.embed);
  }

}
