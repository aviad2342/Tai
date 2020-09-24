import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Album } from './album.model';
import { AlbumService } from './album.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy{

  albums: Album[];
  files: File[] = [];
  selectedAlbum: Album;
  showPhotos = false;
  private albumSubscription: Subscription;

  constructor( private albumService: AlbumService) {}

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
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  onFilesAdded(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
     this.albumService.uploadAlbumPhotos(event.addedFiles, 'bla').subscribe(photos => {
     console.log(photos);
     });
    this.readFile(this.files[0]).then(fileContents => {
      // Put this string in a request body to upload it to an API.
      // console.log(fileContents);
    });
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
