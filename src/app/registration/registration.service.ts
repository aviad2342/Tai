import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const LOCALHOST = environment.LOCALHOST;

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor() { }
}
