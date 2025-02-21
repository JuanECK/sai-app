import { Injectable, Output, EventEmitter, output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Persona {
  name:string
}


@Injectable({
  providedIn: 'root'
})
export class PuenteDataService {

@Output() disparadorData: EventEmitter<any> = new EventEmitter();
@Output() disparadorLogin: EventEmitter<any> = new EventEmitter();
  constructor() { }
}



