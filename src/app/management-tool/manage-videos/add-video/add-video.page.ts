import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Video } from '../../../video/video.model';
import { AppService } from '../../../app.service';
import { VideoService } from '../../../video/video.service';
import { NavController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.page.html',
  styleUrls: ['./add-video.page.scss'],
})
export class AddVideoPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  videoId = '';
  invalidVideoURL = false;
  thumbnail = 'https://www.geirangerfjord.no/upload/images/2018_general/film-and-vid.jpg';

  constructor(
    private videoService: VideoService,
    private navController: NavController,
    public sanitizer: DomSanitizer,
    private appService: AppService
    ) { }

  ngOnInit() {
  }

  onUrlChange(event) {
    if(event.detail.value && this.thumbnail !==  event.detail.value && this.form.control.get('videoURL').valid) {
     this.videoService.getEmbedVimeoVideo(event.detail.value).subscribe(videoObj => {
       this.thumbnail = videoObj.thumbnail_url;
       this.videoId = videoObj.video_id;
       this.invalidVideoURL = false;
     }, error => {
      this.invalidVideoURL = true;
    });
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const videoToAdd = new Video(
      null,
      this.videoId,
      form.value.videoURL,
      'https://player.vimeo.com/video/'+ this.videoId,
      form.value.title,
      form.value.description,
      new Date(),
      this.thumbnail
    );
    this.videoService.addVideo(videoToAdd).subscribe(video => {
      this.appService.presentToast('הסירטון נשמר בהצלחה', true);
      this.navController.navigateBack('/manage/videos');
      form.reset();
    }, error => {
      this.appService.presentToast('חלה תקלה הסירטון לא נשמר!', false);form.reset();
    });
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.navController.navigateBack('/manage/videos');
  }

}
