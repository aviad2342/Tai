import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Treatment } from './treatment.model';

const LOCALHOST = environment.LOCALHOST;

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {

 // tslint:disable-next-line: variable-name
  private _treatments = new BehaviorSubject<Treatment[]>([]);


  get treatments() {
    return this._treatments.asObservable();
  }

  constructor( private http: HttpClient ) { }

  getTreatments() {
    return this.http.get<Treatment[]>(`http://${LOCALHOST}:3000/api/treatment/treatments`)
    .pipe(tap(resDta => {
      this._treatments.next(resDta);
    }));
  }

  getTreatment(id: string) {
    return this.http.get<Treatment>(`http://${LOCALHOST}:3000/api/treatment/treatment/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  addTreatment(treatment: Treatment) {
    return this.http.post<Treatment>(`http://${LOCALHOST}:3000/api/treatment/treatment`,
    {
      ...treatment
    }).
    pipe(
      switchMap(resData => {
        treatment.id = resData.id;
        return this.treatments;
      }),
      take(1),
      switchMap(treatments => {
        this._treatments.next(treatments.concat(treatment));
         return this.getTreatment(treatment.id);
      }));
  }

  updateTreatment(treatment: Treatment) {
    const treatmentObj = {
      treatmentType: treatment.treatmentType,
      description: treatment.description,
      thumbnail: treatment.thumbnail,
      catalogNumber: treatment.catalogNumber,
      therapistId: treatment.therapistId,
      therapistName: treatment.therapistName,
      therapistProfilePicture: treatment.therapistProfilePicture
      };
    return this.http.put<Treatment>(`http://${LOCALHOST}:3000/api/treatment/treatment/${treatment.id}`,
    {
      ...treatmentObj
    }).
    pipe(tap(updatedTreatment => {
        this.getTreatments();
        return updatedTreatment;
      }));
  }

  deleteTreatment(id: string) {
    return this.http.delete(`http://${LOCALHOST}:3000/api/treatment/treatment/${id}`).
    pipe(
      switchMap(resData => {
        return this.getTreatments();
      }),
      tap(treatments => {
        this._treatments.next(treatments.filter(t => t.id !== id));
      }));
  }


  getTreatmentsByTherapist(id: string) {
    return this.http.get<Treatment[]>( `http://${LOCALHOST}:3000/api/treatment/treatment/therapistId/${id}`)
      .pipe(tap(treatments => {
        return treatments;
      }));
  }

  uploadTreatmentThumbnail(image: File, fileName: string) {
    const uploadData = new FormData();
    uploadData.append('image', image, fileName);
    return this.http.post<{ imageUrl: string}>(
      `http://${LOCALHOST}:3000/api/image/uploadTreatmentImage`,
      uploadData
    );
  }
}
