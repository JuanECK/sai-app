import { Component, OnInit } from '@angular/core';
import { PuenteDataService } from '../../core/services/puente-data.service';

@Component({
  selector: 'app-sai',
  standalone:true,
  imports: [],
  templateUrl: './sai.component.html',
  styleUrl: './sai.component.css'
})
export class SaiComponent implements OnInit {

  constructor(
    private puenteData:PuenteDataService,
  ){}

  ngOnInit(): void {
    this.setDataLogin();
  }
  setDataLogin() {
    this.puenteData.disparadorData.emit({dato:'Inicio' , poisionX: '' })
   }
}
