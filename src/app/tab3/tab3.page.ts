import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { Album } from './album.model';
import { AlbumService } from './album.service';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy{

  albums: Album[];
  files: File[] = [];
  images: string[] = [];
  selectedAlbum: Album;
  showPhotos = false;
  private albumSubscription: Subscription;

  constructor( private albumService: AlbumService ,private appService: AppService) {}

  ngOnInit() {
    this.albumSubscription = this.albumService.albums.subscribe(albums => {
      this.albums = albums;
    });
  }

  ionViewWillEnter() {
    this.albumService.getAlbums().subscribe();
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    let imageUrl = '';
    this.images.forEach(image => {
      if(image.includes(event.name)) {
        imageUrl = image;
      }
    });
    console.log(imageUrl);
    this.albumService.deleteAlbumPhoto(imageUrl).subscribe(deleted => {
      this.appService.presentToast(deleted.toString(), true);
      this.files.splice(this.files.indexOf(event), 1);
    }, error => {
      this.appService.presentToast('חלה תקלה התמונה לא הוסרה!', false);
    } );
  }

  onFilesAdded(event) {
    this.files.push(...event.addedFiles);
    const imageFiles: any[] =[];
    this.files.forEach(file => {
      imageFiles.push(this.readImage(file));
    });
    this.albumService.uploadAlbumPhotos(imageFiles).subscribe(images => {
      this.images.push(...images);
      console.log(images);
      });
    // this.readFile(this.files[0]).then(fileContents => {

    // });
  }

  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };

      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }

      reader.readAsDataURL(file);
    });
  }

  readImage(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    return imageFile;

  }

  onSelectAlbum(id: string) {
    this.albumService.getAlbum(id).subscribe(album => {
      this.selectedAlbum = album;
      this.showPhotos = true;
    });
  }

  ngOnDestroy() {
    if (this.albumSubscription) {
      this.albumSubscription.unsubscribe();
    }
  }

}
