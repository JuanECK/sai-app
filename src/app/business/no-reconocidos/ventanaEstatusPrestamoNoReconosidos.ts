import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, ViewChild } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import {  DIALOG_DATA } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from "@angular/forms";
import { noReconocidos } from "../../core/services/noReconocidos.service";

@Component({
  selector: 'Ventana-Estatus-Prestamo-Asignacion-No-Reconosidos',
  standalone: true,
  imports: [ MatDialogModule, MatButtonModule, ReactiveFormsModule ],
  template: `

    <div class="content-modalMsg">
      <div class="text-center">
        <h1>Confirmar el pago</h1>
      </div>
      <div class="text-center mensaje-modalMsg">
        Esto cambiará el estatus del movimiento
        a pagado
      </div>
    </div>
    <div class="btn-group">
        <button class="buttonFull" [mat-dialog-close]="true" (click)="enviarAsignacion()" >Continuar</button>
        <button class="buttonFull" mat-dialog-close>Cancel</button>
    </div>

  `,
  styleUrl: './cdk-dialog-style.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VentanaEstatusPrestamoNoReconosidos implements OnInit {
  constructor(
    public servicio: noReconocidos
  ){}

  public readonly dataModal = inject(DIALOG_DATA);

  
  ngOnInit(): void {
    console.log( this.dataModal)
  }


async enviarAsignacion(){

// let data = await this.servicio.setAsignacion(  )

//   if( data.status === 'error' ){
//     this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data.data }, false, '300px', 'error')
//     return
//   }
//   this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data.data }, false, '300px', 'exito')
//   document.getElementById('cerrar')?.click()


}


}