import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Video } from './video.model';

const LOCALHOST = environment.LOCALHOST;

export interface VideoResponseData {
  video_id: string;
  thumbnail_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {

    // tslint:disable-next-line: variable-name
    private _videos = new BehaviorSubject<Video[]>([]);

    private _savedVideo = new BehaviorSubject<string[]>([]);

    get videos() {
      return this._videos.asObservable();
    }

    get savedVideos() {
      return this._savedVideo.asObservable();
    }

  constructor( private http: HttpClient ) {}

  getAllVideos() {
    return this.videos.pipe(
      map (videos => {
        return videos;
      })
    );
  }

  getVideos() {
    return this.http.get<Video[]>(`http://${LOCALHOST}:3000/api/video/videos`)
    .pipe(tap(resDta => {
      this._videos.next(resDta);
    }));
  }

  getVideo(id: string) {
    return this.http.get<Video>(`http://${LOCALHOST}:3000/api/video/video/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  addVideo(video: Video) {
    return this.http.post<Video>(`http://${LOCALHOST}:3000/api/video/video`,
    {
      ...video
    }).
    pipe(
      switchMap(resData => {
        video.id = resData.id;
        return this.videos;
      }),
      take(1),
      tap(videos => {
        this._videos.next(videos.concat(video));
      }));
  }


  updateVideo(video: Video) {
    const videoObj = {
      videoId:     video.videoId,
      videoURL:    video.videoURL,
      embed:       video.embed,
      title:       video.title,
      description: video.description,
      date:        video.date,
      thumbnail:   video.thumbnail
      };
    return this.http.put<Video>(`http://${LOCALHOST}:3000/api/video/video/${video.id}`,
    {
      ...videoObj
    }).
    pipe(
      switchMap(resData => {
        return this.getVideos();
      }),
      switchMap(videos => {
        // this._videos.next(updates);
        return videos.filter(u => u.id === video.id);
      }),
      take(1),
      tap(videoData => {
        return videoData;
      }));
  }

  deleteVideo(id: string) {
    return this.http.delete(`http://${LOCALHOST}:3000/api/video/video/${id}`).
    pipe(
      switchMap(resData => {
        return this.getVideos();
      }),
      tap(videos => {
        this._videos.next(videos.filter(v => v.id !== id));
      }));
  }

  getVimeoVideo(videoId: string) {
    return this.http.get(`https://vimeo.com/api/v2/video/${videoId}.json`).
    pipe(
      map(resData => {
        return resData;
      }));
  }

  getEmbedVimeoVideo(videoURL: string) {
    return this.http.get<VideoResponseData>(`https://vimeo.com/api/oembed.json?url=${videoURL}`).
    pipe(
      map(resData => {
        return resData;
      }));
  }

  getSavedVideos() {
    return from(Plugins.Storage.get({ key: 'savedVideos' })).pipe(
      map(videosData => {
        if (!videosData || !videosData.value) {
          return null;
        }
        const parsedData = JSON.parse(videosData.value) as {
          videos: string[];
        };
        return parsedData;
      }),
      tap(data => {
        if (data) {
           this._savedVideo.next(data.videos);
           return data.videos;
        }
      }));
  }

  storeSavedVideosData(savedVideosList: string[]) {
    const data = JSON.stringify({
      videos: savedVideosList
    });
    Plugins.Storage.set({ key: 'savedVideos', value: data });
  }

}
