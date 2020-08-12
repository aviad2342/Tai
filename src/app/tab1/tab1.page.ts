import { Component, OnInit, AfterViewInit } from '@angular/core';
import { YoutubePlayerWeb, YoutubePlayerPluginWeb } from 'capacitor-youtube-player';
import { Capacitor, Plugins } from '@capacitor/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterViewInit {

  currentYear = new Date().getFullYear();
  currentTime: YoutubePlayerPluginWeb;
  bb;

  constructor() {}


  ngOnInit() {
  }

  ngAfterViewInit() {
    if (Capacitor.platform === 'web') {
      this.initializeYoutubePlayerPluginWeb();
    } else { // Native
      this.initializeYoutubePlayerPluginNative();
    }
  }

  async initializeYoutubePlayerPluginWeb() {
    const options = {playerId: 'youtube-player', playerSize: {width: 640, height: 360}, videoId: 'M0_-eBtW0p4'};
    const result  = await YoutubePlayerWeb.initialize(options);

    (result as any).player.addEventListener('onStateChange', (event) => {
      console.log('state is', event.target);
      console.log(event.target.playerInfo.currentTime);
    });
  await YoutubePlayerWeb.getCurrentTime('youtube-player').then(data => {
    console.log(data.result);
  });
    await YoutubePlayerWeb.cueVideoById('youtube-player',{
      videoId:'M0_-eBtW0p4',
    }).then(data => {
      console.log(data.result);
    });
    console.log('playerReady', result);
  }

  async destroyYoutubePlayerPluginWeb() {
    const result = await YoutubePlayerWeb.destroy('youtube-player');
    console.log('destroyYoutubePlayer', result);
  }

  async initializeYoutubePlayerPluginNative() {

    const { YoutubePlayer } = Plugins;

    const options = {width: 640, height: 360, videoId: 'tDW2C6rcH6M'};
    const playerReady = await YoutubePlayer.initialize(options);
  }

}
