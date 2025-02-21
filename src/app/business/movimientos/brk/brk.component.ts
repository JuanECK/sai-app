import { Component, EventEmitter, OnInit, output, Output } from '@angular/core';
import { Observable } from  'rxjs' ; 
import { PuenteDataService } from '../../../core/services/puente-data.service';

@Component({
  selector: 'app-brk',
  standalone:true,
  imports: [],
  templateUrl: './brk.component.html',
  styleUrl: './brk.component.css'
})
export class BrkComponent implements OnInit {
  constructor(
    public puenteData:PuenteDataService,
  ){}
  
  ngOnInit(): void {
    this.setDataLogin();

  }

  setDataLogin() {
    this.puenteData.disparadorData.emit({dato:'BRK'})
   }
  
}
