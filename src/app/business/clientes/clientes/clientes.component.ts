import { Component, OnInit } from '@angular/core';
import { PuenteDataService } from '../../../core/services/puente-data.service';


@Component({
  selector: 'app-clientes',
  standalone:true,
  imports: [],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  constructor(
    public puenteData:PuenteDataService,
  ){}

  ngOnInit(): void {
    this.setDataLogin();
  }

  setDataLogin() {
    this.puenteData.disparadorData.emit({dato:'Clientes'})
   }
}
