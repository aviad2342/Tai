import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Event } from './event.model';
import { Speaker, speakerTitle } from './speaker.model';
import { take, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Participant } from './participant.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {Participant

  // tslint:disable-next-line: variable-name
  private _events = new BehaviorSubject<Event[]>([]);

  // tslint:disable-next-line: variable-name
  private _speakers = new BehaviorSubject<Speaker[]>([]);

  // tslint:disable-next-line: variable-name
  private _participants = new BehaviorSubject<Participant[]>([]);


  get events() {
    return this._events.asObservable();
  }

  get speakers() {
    return this._speakers.asObservable();
  }

  get participants() {
    return this._participants.asObservable();
  }

  constructor(private http: HttpClient ) { }

  // getEvent(id: string) {
  //   return this.events.pipe(
  //     take(1),
  //     map(events => {
  //       return { ...events.find(p => p.id === id) };
  //     })
  //   );
  // }

  getEvents() {
    return this.http.get<Event[]>('http://localhost:3000/api/event/events')
    .pipe(tap(resDta => {
      this._events.next(resDta);
    }));
  }

  getEvent(id: string) {
    return this.http.get<Event>(`http://localhost:3000/api/event/event/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  addEvent(event: Event) {
    return this.http.post<{id: string}>('http://localhost:3000/api/event/event',
    {
      ...event
    }).
    pipe(
      switchMap(resData => {
        event.id = resData.id;
        return this.events;
      }),
      take(1),
      switchMap(events => {
        this._events.next(events.concat(event));
        return this.getEvent(event.id);
      }));
  }


  updateEvent(event: Event) {
    const eventObj = {
       title:         event.title,
       description:   event.description,
       date:          event.date,
       beginsAt:      event.beginsAt,
       endsAt:        event.endsAt,
       thumbnail:     event.thumbnail,
       maxCapacity:   event.maxCapacity,
       placeName:     event.placeName,
       country:       event.country,
       city:          event.city,
       street:        event.street,
       houseNumber:   event.houseNumber,
       apartment:     event.apartment,
       entry:         event.entry,
       catalogNumber: event.catalogNumber,
       images:        event.images,
       participants:  event.participants,
       speakers:      event.speakers
      };
    return this.http.put(`http://localhost:3000/api/event/event/${event.id}`,
    {
      ...eventObj
    }).
    pipe(
      switchMap(resData => {
        return this.getEvents();
      }),
      tap(events => {
        this._events.next(events);
      }));
  }

  updateEventImages(id: string, images: string[]) {
    return this.http.put(`http://localhost:3000/api/event/event/images/${id}`,
    {
      images
    }).
    pipe(
      switchMap(resData => {
        return this.getEvents();
      }),
      tap(events => {
        this._events.next(events);
      }));
  }

  deleteEvent(id: string) {
    return this.http.delete(`http://localhost:3000/api/event/event/${id}`).
    pipe(
      switchMap(resData => {
        return this.getEvents();
      }),
      tap(events => {
        this._events.next(events.filter(u => u.id !== id));
      }));
  }

  deleteImage(image: string) {
    const imageParam = new HttpParams();
    imageParam.set('image', image);
    return this.http.delete<{ response: string}>('http://localhost:3000/api/image/deletImage', {params: imageParam}).
    pipe(
      map(resData => {
        return resData.response;
      }));
  }

  getArticleByUser(authorId: string) {
    return this.http
      .get<Event>(
        `http://localhost:3000/api/event/event/authorId/${authorId}`)
      .pipe(tap(event => {
        return event;
      }));
  }

  uploadEventThumbnail(image: File, fileName: string) {
    const uploadData = new FormData();
    uploadData.append('image', image, fileName);
    return this.http.post<{ imageUrl: string}>(
      'http://localhost:3000/api/image/uploadEventImage',
      uploadData
    );
  }

  uploadEventPhotos(photos: File[]) {
    const uploadData = new FormData();
    photos.forEach(photo => {
      uploadData.append('images', photo);
    });
    return this.http.post<string[]>(
      'http://localhost:3000/api/image/uploadEventePictures',
      uploadData
    ).pipe(
      map(images => {
         return images;
      })
    );
  }

// ------------------------------------ Speaker Services -----------------------------------

  getSpeakers() {
    return this.http.get<Speaker[]>('http://localhost:3000/api/speaker/speakers')
    .pipe(tap(resDta => {
      this._speakers.next(resDta);
    }));
  }

  getSpeaker(id: string) {
    return this.http.get<Speaker>(`http://localhost:3000/api/speaker/speaker/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  addSpeaker(speaker: Speaker) {
    return this.http.post<Speaker>('http://localhost:3000/api/speaker/speaker',
    {
      ...speaker
    }).
    pipe(tap(resDta => {
      return resDta;
    }));
  }

  updateSpeaker(speaker: Speaker) {
    const speakerObj = {
      title:       speaker.title,
      firstName:   speaker.firstName,
      lastName:    speaker.lastName,
      description: speaker.description,
      picture:     speaker.picture,
      eventId:     speaker.event
      };
    return this.http.put(`http://localhost:3000/api/speaker/speaker/${speaker.id}`,
    {
      ...speakerObj
    }).
    pipe(
      switchMap(resData => {
        return this.getSpeakers();
      }),
      tap(speakers => {
        this._speakers.next(speakers);
      }));
  }

  deleteSpeaker(id: string) {
    return this.http.delete(`http://localhost:3000/api/speaker/speaker/${id}`).
    pipe(
      switchMap(resData => {
        return this.getSpeakers();
      }),
      tap(speakers => {
        this._speakers.next(speakers.filter(u => u.id !== id));
      }));
  }

  // deleteArticleComments(articleId: string) {
  //   return this.http.delete(`http://localhost:3000/api/comment/comment/articleId/${articleId}`).
  //   pipe(
  //     switchMap(resData => {
  //       return this.getComments();
  //     }),
  //     tap(comments => {
  //       this._comments.next(comments.filter(u => u.articleId !== articleId));
  //     }));
  // }

  getEventSpeakers(articleId: string) {
    return this.http.get<Speaker[]>( `http://localhost:3000/api/speaker/speaker/articleId/${articleId}`)
      .pipe(tap(speakers => {
        this._speakers.next(speakers);
      }));
  }

  getSpeakerByEvent(authorId: string) {
    return this.http
      .get<Speaker[]>(
        `http://localhost:3000/api/speaker/speaker/authorId/${authorId}`)
      .pipe(tap(speakers => {
        return speakers;
      }));
  }

  uploadSpeakerPicture(image: File, fileName: string) {
    const uploadData = new FormData();
    uploadData.append('image', image, fileName);
    return this.http.post<{ imageUrl: string}>(
      'http://localhost:3000/api/image/uploadSpeakerImage',
      uploadData
    );
  }

  // ------------------------------------ Participant Services -----------------------------------

  getParticipants() {
    return this.http.get<Participant[]>('http://localhost:3000/api/participant/participants')
    .pipe(tap(resDta => {
      this._participants.next(resDta);
    }));
  }

  getParticipant(id: string) {
    return this.http.get<Participant>(`http://localhost:3000/api/participant/participant/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  addParticipant(participant: Participant) {
    return this.http.post<Participant>('http://localhost:3000/api/participant/participant',
    {
      ...participant
    }).
    pipe(tap(resDta => {
      return resDta;
    }));
  }

  updateParticipant(participant: Participant) {
    const participantObj = {
      firstName:   participant.firstName,
      lastName:    participant.lastName,
      picture:     participant.picture,
      eventId:     participant.event
      };
    return this.http.put(`http://localhost:3000/api/participant/participant/${participant.id}`,
    {
      ...participantObj
    }).
    pipe(
      switchMap(resData => {
        return this.getParticipants();
      }),
      tap(participants => {
        this._participants.next(participants);
      }));
  }

  deleteParticipant(id: string) {
    return this.http.delete(`http://localhost:3000/api/participant/participant/${id}`).
    pipe(
      switchMap(resData => {
        return this.getParticipants();
      }),
      tap(participants => {
        this._participants.next(participants.filter(u => u.id !== id));
      }));
  }

  getEventParticipants(articleId: string) {
    return this.http.get<Participant[]>( `http://localhost:3000/api/participant/participant/articleId/${articleId}`)
      .pipe(tap(participants => {
        this._participants.next(participants);
      }));
  }

  getParticipantByEvent(eventId: string) {
    return this.http
      .get<Participant[]>(
        `http://localhost:3000/api/participant/participant/authorId/${eventId}`)
      .pipe(tap(participants => {
        return participants;
      }));
  }

  uploadParticipantPicture(image: File, fileName: string) {
    const uploadData = new FormData();
    uploadData.append('image', image, fileName);
    return this.http.post<{ imageUrl: string}>(
      'http://localhost:3000/api/image/uploadParticipantImage',
      uploadData
    );
  }


}


