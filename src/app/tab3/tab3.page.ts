import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GALLERY_CONF, GALLERY_IMAGE, NgxImageGalleryComponent } from 'ngx-image-gallery';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { Album } from './album.model';
import { AlbumService } from './album.service';
import { Image } from './image.model';

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


  @ViewChild(NgxImageGalleryComponent) ngxImageGallery: NgxImageGalleryComponent;

  albums: Album[];
  files: File[] = [];
  images: string[] = [];
  galleryImages: GALLERY_IMAGE[] = [];
  selectedAlbum: Album;
  showPhotos = false;
  private albumSubscription: Subscription;

  conf: GALLERY_CONF = {
    imageOffset: '0px',
    showDeleteControl: false,
    showImageTitle: false,
  };

  gimages: GALLERY_IMAGE[] = [
    {
      url: 'https://images.pexels.com/photos/669013/pexels-photo-669013.jpeg?w=1260',
      altText: 'woman-in-black-blazer-holding-blue-cup',
      title: 'woman-in-black-blazer-holding-blue-cup',
      thumbnailUrl: 'https://images.pexels.com/photos/669013/pexels-photo-669013.jpeg?w=60'
    },
    {
      url: 'https://images.pexels.com/photos/669006/pexels-photo-669006.jpeg?w=1260',
      altText: 'two-woman-standing-on-the-ground-and-staring-at-the-mountain',
      extUrl: 'https://www.pexels.com/photo/two-woman-standing-on-the-ground-and-staring-at-the-mountain-669006/',
      thumbnailUrl: 'https://images.pexels.com/photos/669006/pexels-photo-669006.jpeg?w=60'
    },
  ];

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
    console.log(event.name);
    this.images.forEach(image => {
      if(image.includes(event.name)) {
        console.log(image);
        imageUrl = image;
      }
    });
    const imageToDelete = imageUrl.split('http://localhost:3000/eventImages/');
    console.log(imageToDelete[1]);
    this.albumService.deleteAlbumPhoto(imageToDelete[1]).subscribe(response => {
      this.appService.presentToast(response, true);
      this.files.splice(this.files.indexOf(event), 1);
    }, error => {
      this.appService.presentToast('חלה תקלה התמונה לא הוסרה!', false);
    } );
  }

  onFilesAdded(event) {
    this.files.push(...event.addedFiles);
    // const imageFiles: any[] =[];
    // this.files.forEach(file => {
    //   imageFiles.push(this.readImage(file));
    // });
    this.albumService.uploadAlbumPhotos(event.addedFiles).subscribe(images => {
      this.images.push(...images);
      this.galleryImages.push(...this.setGalleryImages(images));
      this.openGallery();
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

  setGalleryImages(images: string[]) {
    const galleryImages: Image[] = [];
    images.forEach(image => {
      galleryImages.push(new Image(image, image));
    });
    return galleryImages;
  }

  openGallery(index: number = 0) {
    this.ngxImageGallery.open(index);
  }

  // close gallery
  closeGallery() {
    this.ngxImageGallery.close();
  }

  // set new active(visible) image in gallery
  newImage(index: number = 0) {
    this.ngxImageGallery.setActiveImage(index);
  }

  // next image in gallery
  nextImage(index: number = 0) {
    this.ngxImageGallery.next();
  }

  // prev image in gallery
  prevImage(index: number = 0) {
    this.ngxImageGallery.prev();
  }

  /**************************************************/

  // EVENTS
  // callback on gallery opened
  galleryOpened(index) {
    console.log('Gallery opened at index ', index);
  }

  // callback on gallery closed
  galleryClosed() {
    console.log('Gallery closed.');
  }

  // callback on gallery image clicked
  galleryImageClicked(index) {
    console.log('Gallery image clicked with index ', index);
  }

  // callback on gallery image changed
  galleryImageChanged(index) {
    console.log('Gallery image changed to index ', index);
  }

  // callback on user clicked delete button
  deleteImage(index) {
    console.log('Delete image at index ', index);
  }

  ngOnDestroy() {
    if (this.albumSubscription) {
      this.albumSubscription.unsubscribe();
    }
  }

}
