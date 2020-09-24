import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { Album } from './album.model';
import { Photo } from './photo.model';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

      // tslint:disable-next-line: variable-name
      private _albums = new BehaviorSubject<Album[]>([]);

      // tslint:disable-next-line: variable-name
      private _photos = new BehaviorSubject<Photo[]>([]);


      get albums() {
        return this._albums.asObservable();
      }

      get photos() {
        return this._photos.asObservable();
      }

      constructor(private http: HttpClient ) { }

      // ------------------------------------ Comment Services -----------------------------------

      getAlbums() {
        return this.http.get<Album[]>('http://localhost:3000/api/album/albums')
        .pipe(tap(resDta => {
          this._albums.next(resDta);
        }));
      }

      getAlbum(id: string) {
        return this.http.get<Album>(`http://localhost:3000/api/album/album/${id}`)
        .pipe(tap(resDta => {
          return resDta;
        }));
      }

      addAlbum(album: Album) {
        return this.http.post<{id: string}>('http://localhost:3000/api/album/album',
        {
          ...album
        }).
        pipe(
          switchMap(resData => {
            album.id = resData.id;
            return this.albums;
          }),
          take(1),
          tap(albums => {
            this._albums.next(albums.concat(album));
          }));
      }

      updateAlbum(album: Album) {
        const albumObj = {
           authorId: album.authorId,
           authorName: album.authorName,
           title: album.title,
           description: album.description,
           date: album.date,
           lastEdit: album.lastEdit,
           thumbnail: album.thumbnail,
           views: album.views,
           photos: album.photos
          };
        return this.http.put(`http://localhost:3000/api/album/album/${album.id}`,
        {
          ...albumObj
        }).
        pipe(
          switchMap(resData => {
            return this.getAlbums();
          }),
          tap(albumss => {
            this._albums.next(albumss);
          }));
      }

      deleteAlbum(id: string) {
        return this.http.delete(`http://localhost:3000/api/album/album/${id}`).
        pipe(
          switchMap(resData => {
            return this.getAlbums();
          }),
          tap(albums => {
            this._albums.next(albums.filter(u => u.id !== id));
          }));
      }

      getAlbumByUser(authorId: string) {
        return this.http
          .get<Album>(
            `http://localhost:3000/api/album/album/authorId/${authorId}`)
          .pipe(tap(album => {
            return album;
          }));
      }

      uploadAlbumThumbnail(image: File, fileName: string) {
        const uploadData = new FormData();
        uploadData.append('image', image, fileName);
        return this.http.post<{ imageUrl: string}>(
          'http://localhost:3000/api/image/uploadArticleImage',
          uploadData
        );
      }

   // ------------------------------------ Comment Services -----------------------------------

      getPhotos() {
        return this.http.get<Photo[]>('http://localhost:3000/api/photo/photos')
        .pipe(tap(resDta => {
          this._photos.next(resDta);
        }));
      }

      getPhotosOfAlbum(id: string) {
        return this.http.get<Photo[]>(`http://localhost:3000/api/photo/photo/photos/${id}`)
        .pipe(tap(resDta => {
          this._photos.next(resDta);
        }));
      }

      getPhotoAlbum(id: string) {
        return this.http.get<Album>(`http://localhost:3000/api/photo/photo/album/${id}`)
        .pipe(tap(resDta => {
          return resDta;
        }));
      }

      getPhoto(id: string) {
        return this.http.get<Photo>(`http://localhost:3000/api/photo/photo/${id}`)
        .pipe(tap(resDta => {
          return resDta;
        }));
      }

      addPhoto(photo: Photo) {
        return this.http.post<{id: string}>('http://localhost:3000/api/photo/photo',
        {
          ...photo
        }).
        pipe(
          switchMap(resData => {
            photo.id = resData.id;
            return this.photos;
          }),
          take(1),
          tap(photos => {
            this._photos.next(photos.concat(photo));
          }));
      }

      updatePhoto(photo: Photo) {
        const photoObj = {
           title: photo.title,
           description: photo.description,
           date: photo.date,
           url: photo.url,
          };
        return this.http.put(`http://localhost:3000/api/photo/photo/${photo.id}`,
        {
          ...photoObj
        }).
        pipe(
          switchMap(resData => {
            return this.getPhotos();
          }),
          tap(photos => {
            this._photos.next(photos);
          }));
      }

      deletePhoto(id: string) {
        return this.http.delete(`http://localhost:3000/api/photo/photo/${id}`).
        pipe(
          switchMap(resData => {
            return this.getPhotos();
          }),
          tap(comments => {
            this._photos.next(comments.filter(u => u.id !== id));
          }));
      }

      deleteAlbumPhotos(albumId: string) {
        return this.http.delete(`http://localhost:3000/api/photo/photo/articleId/${albumId}`).
        pipe(
          switchMap(resData => {
            return this.getAlbumPhotos(albumId);
          }),
          tap(photos => {
            this._photos.next(photos);
          }));
      }

      getAlbumPhotos(articleId: string) {
        return this.http.get<Photo[]>( `http://localhost:3000/api/comment/comment/articleId/${articleId}`)
          .pipe(tap(comments => {
            this._photos.next(comments);
          }));
      }

      getCommentByUser(authorId: string) {
        return this.http
          .get<Photo[]>(
            `http://localhost:3000/api/comment/comment/authorId/${authorId}`)
          .pipe(tap(comments => {
            return comments;
          }));
      }

      uploadAlbumPhotos(photos: File[], fileName: string) {
        // const uploadData = new FormData();
        // uploadData.append('images', photos, fileName);
        return this.http.post<object>(
          'http://localhost:3000/api/image/uploadEventePictures',
          photos
        );
      }

}
