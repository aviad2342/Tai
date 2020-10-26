import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private platform: Platform, public toastController: ToastController) { }

  isDesktop() {
    return this.platform.is('desktop');
  }

  isRTL() {
    return this.platform.isRTL;
  }

  async presentToast(message: string, isSuccess: boolean) {
    const color = (isSuccess) ? 'success' : 'danger';
    const icon = (isSuccess) ? 'checkmark-sharp' : 'alert-outline';
    const toast = await this.toastController.create({
      color,
      cssClass: 'toast-scheme',
      message,
      mode: 'ios',
      animated: true,
      duration: 2000,
      buttons: [
        {
          side: 'start',
          icon
        }
      ]
    });
    toast.present();
  }
}
