import { Injectable, Output, EventEmitter, output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PuenteDataService {
@Output() disparadorData: EventEmitter<any> = new EventEmitter();
  constructor() { }
}


