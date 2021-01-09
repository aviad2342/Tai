import { Component, OnInit, ViewChild, Output, Input, ElementRef, EventEmitter } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType} from '@capacitor/core';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {

  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview = false;
  @Input() selectedImage: string;
  usePicker = false;
  MIME_TYPE_MAP: object = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

  constructor(
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private alertController: AlertController,
    ) { }

  ngOnInit() {
    // console.log('Mobile:', this.platform.is('mobile'));
    // console.log('Hybrid:', this.platform.is('hybrid'));
    // console.log('iOS:', this.platform.is('ios'));
    // console.log('Android:', this.platform.is('android'));
    // console.log('Desktop:', this.platform.is('desktop'));
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.usePicker = true;
    }
  }

  onPickImageSource() {
    if(this.platform.is('mobile')) {
      this.onPickImage();
    } else {
      this.filePickerRef.nativeElement.click();
    }
    // this.actionSheetCtrl
    //   .create({
    //     mode: 'ios',
    //     cssClass: 'action-sheet',
    //     header: 'בחר מקור',
    //     buttons: [
    //       {
    //         text: 'ספריית תמונות',
    //         handler: () => {
    //           this.filePickerRef.nativeElement.click();
    //         }
    //       },
    //       {
    //         text: 'מצלמה',
    //         handler: () => {
    //           this.onPickImage();
    //         }
    //       },
    //       { text: 'ביטול', role: 'cancel' }
    //     ]
    //   }).then(actionSheetEl => {
    //     actionSheetEl.present();
    //   });
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    } else{
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 350,
      width: 450,
      resultType: CameraResultType.DataUrl
    })
      .then(image => {
        this.selectedImage = image.dataUrl;
        this.imagePick.emit(image.dataUrl);
      })
      .catch(error => {
        console.log(error);
        if (this.usePicker) {
          this.filePickerRef.nativeElement.click();
        }
        return false;
      });
    }
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    if(!this.MIME_TYPE_MAP[pickedFile.type]) {
      this.onErrorImageType();
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }

  async onErrorImageType() {
    const alert = await this.alertController.create({
      cssClass: 'error-image-type-alert',
      header: 'פורמט תמונה שגוי',
      message: `אנא בחר תמונה בפורמטים הבאים: png, jpg, jpeg`,
      mode: 'ios',
      buttons: [{
          text: 'אישור',
        }
      ]
    });
    await alert.present();
}

}
