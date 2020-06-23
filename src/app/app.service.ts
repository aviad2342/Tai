import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private platform: Platform) { }

  isDesktop() {
    return this.platform.is('desktop');
  }

  isRTL() {
    return this.platform.isRTL;
  }
}
