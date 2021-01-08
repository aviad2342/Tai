import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Therapist } from './therapist.model';

const LOCALHOST = '10.0.0.1';

@Injectable({
  providedIn: 'root'
})
export class TherapistService {

  // tslint:disable-next-line: variable-name
  private _therapists = new BehaviorSubject<Therapist[]>([]);

  get therapists() {
    return this._therapists.asObservable();
  }

  constructor( private http: HttpClient ) { }

  getTherapists() {
    return this.http.get<Therapist[]>(`http://${LOCALHOST}:3000/api/therapist/therapists`)
    .pipe(tap(resDta => {
      this._therapists.next(resDta);
    }));
  }

  getAllTherapists() {
    return this.http.get(`http://${LOCALHOST}:3000/api/therapist/therapists`)
    .pipe(tap(resDta => {
    }));
  }


  getTherapist(id: string) {
    return this.http.get<Therapist>(`http://${LOCALHOST}:3000/api/therapist/therapist/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  getTherapistByEmail(email: string) {
    return this.http
      .get<Therapist>(
        `http://${LOCALHOST}:3000/api/therapist/therapist/email/${email}`)
      .pipe(tap(therapist => {
        return therapist;
      }));
  }

  uploadImage(image: File, fileName: string) {
    const uploadData = new FormData();
    uploadData.append('image', image, fileName);
    return this.http.post<{ imageUrl: string}>(
      `http://${LOCALHOST}:3000/api/image/uploadTherapistImage`,
      uploadData
    );
  }

  addTherapist(therapist: Therapist) {
    return this.http.post<{id: string}>(`http://${LOCALHOST}:3000/api/therapist/therapist`,
    {
      ...therapist
    }).
    pipe(
      switchMap(resData => {
        therapist.id = resData.id;
        return this.therapists;
      }),
      take(1),
      tap(therapists => {
        this._therapists.next(therapists.concat(therapist));
      }));
  }

  updateTherapist(therapist: Therapist) {
    const therapistObj = {
      firstName: therapist.firstName,
      lastName: therapist.lastName,
      email: therapist.email,
      phone: therapist.phone,
      password: therapist.password,
      date: therapist.date,
      country: therapist.country,
      city: therapist.city,
      street: therapist.street,
      houseNumber: therapist.houseNumber,
      apartment: therapist.apartment,
      entry: therapist.entry,
      profilePicture: therapist.profilePicture,
      treatmentTypes: therapist.treatmentTypes,
      resume: therapist.resume,
      admin: therapist.admin
      };
    return this.http.put(`http://${LOCALHOST}:3000/api/therapist/therapist/${therapist.id}`,
    {
      ...therapistObj
    }).
    pipe(
      switchMap(resData => {
        return this.getTherapists();
      }),
      switchMap(therapists => {
        this._therapists.next(therapists);
        return therapists.filter(t => t.id === therapist.id);
      }),
      take(1),
      tap(therapistData => {
        return therapistData;
      }));
  }

  updateTherapistAndProfilePicture(therapist: Therapist) {
    const therapistObj = {
      firstName: therapist.firstName,
      lastName: therapist.lastName,
      email: therapist.email,
      phone: therapist.phone,
      password: therapist.password,
      date: therapist.date,
      country: therapist.country,
      city: therapist.city,
      street: therapist.street,
      houseNumber: therapist.houseNumber,
      apartment: therapist.apartment,
      entry: therapist.entry,
      profilePicture: therapist.profilePicture,
      treatmentTypes: therapist.treatmentTypes,
      resume: therapist.resume,
      admin: therapist.admin
      };
    return this.http.put(`http://${LOCALHOST}:3000/api/therapist/therapist/image/${therapist.id}`,
    {
      ...therapistObj
    }).
    pipe(
      switchMap(resData => {
        return this.getTherapists();
      }),
      switchMap(therapists => {
        this._therapists.next(therapists);
        return therapists.filter(t => t.id === therapist.id);
      }),
      take(1),
      tap(therapistData => {
        return therapistData;
      }));
  }

  deleteTherapist(id: string) {
    return this.http.delete(`http://${LOCALHOST}:3000/api/therapist/therapist/${id}`).
    pipe(
      switchMap(resData => {
        return this.getTherapists();
      }),
      tap(therapists => {
        this._therapists.next(therapists.filter(t => t.id !== id));
      }));
  }
}
