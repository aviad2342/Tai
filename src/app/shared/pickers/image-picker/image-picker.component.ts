import { Component, OnInit, ViewChild, Output, Input, ElementRef, EventEmitter } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType} from '@capacitor/core';
import { ActionSheetController, Platform } from '@ionic/angular';

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

  constructor(private platform: Platform, private actionSheetCtrl: ActionSheetController,) { }

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
    this.actionSheetCtrl
      .create({
        mode: 'ios',
        cssClass: 'action-sheet',
        header: 'בחר מקור',
        buttons: [
          {
            text: 'ספריית תמונות',
            handler: () => {
              this.filePickerRef.nativeElement.click();
            }
          },
          {
            text: 'מצלמה',
            handler: () => {
              this.onPickImage();
            }
          },
          { text: 'ביטול', role: 'cancel' }
        ]
      }).then(actionSheetEl => {
        actionSheetEl.present();
      });
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
      // height: 320,
      width: 600,
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
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }

}
