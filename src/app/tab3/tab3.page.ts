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
