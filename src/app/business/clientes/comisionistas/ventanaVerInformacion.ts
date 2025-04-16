import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import { Dialog, DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { Comisionistas } from "../../../core/services/comisionistas.service";
import { blob } from "stream/consumers";
import { ModalMsgService } from "../../../core/services/modal-msg.service";
import { ModalMsgComponent } from "../../../core/modal-msg/modal-msg.component";

@Component({
  selector: 'Ventana-Ver-Informacion-Msg',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `

      <div class="content-modalMsg">
        <div class="titulo">
          <h1>Resumen de información</h1>
          <div mat-dialog-close >
            <img src="/img-sai/icono-X-.png" alt="Cerrar">
          </div>
        </div>
        <div class="bodyCard">
          <div class="text-center mensaje-modalMsg">
            <table class="table">
              <tbody>
                @for( item of dataModal[0]; track $index ){
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">Nombre</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.Nombre_Razon_Social}}</td>
                  </tr>
                  <tr>
                    <th class="thead-th-blod-No-Border ">Tipo de persona</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.Fisica_Moral ? 'Fisica':'Moral'}}</td>
                  </tr>
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">RFC</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.RFC}}</td>
                  </tr>
                  <tr>
                    <th class="thead-th-blod-No-Border ">No. telefónico</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.Telefono}}</td>
                  </tr>
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">Correo</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.Correo}}</td>
                  </tr>
                  <tr>
                    <th class="thead-th-blod-No-Border ">Dirección</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.Calle +', No. '+ item.No_Exterior +', Col '+item.Colonia+', CP '+item.CP +', '+ item.Minicipio +', '+ item.Estado }}</td>
                  </tr>
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">No de Comisionista</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.Num_Comisionista}}</td>
                  </tr>
                }
                
              </tbody>
            </table>
          </div>
        </div>
        <div class="btn-options">
          <h2>Documentación</h2>
          <p>Puedes visualizar e imprimir estos documentos</p>
          <div class="btn-acction">
            <div (click)="verIdentificacion()" class="btn-group">
              <img src="/img-sai/Icon-id.png" alt="Identificación">
              <p>Identificación</p>
            </div>
            <div (click)="verDomicilio()" class="btn-group">
              <img src="/img-sai/icon-comprobantedeDomicilio.png" alt="Comprobante de domicilio">
              <p>Comprobante <br> de domicilio</p>
            </div>
            <div (click)="verContrato()" class="btn-group">
              <img src="/img-sai/icon-contrato.png" alt="Contrato">
              <p>Contrato</p>
            </div>
          </div>
        </div>
      </div>
  `,
  styleUrl: 'cdk-Informacion-style.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VentanaVerInformacion {
  constructor(
    public servicio: Comisionistas
  ){}

  public readonly dataModal = inject(DIALOG_DATA);
  private readonly _modalMsg = inject(ModalMsgService)
  // data = this.dataModal.data.data


  async verIdentificacion(){
    this.servicio.descargaComprobante( this.dataModal[0][0].INE )
    .then( (data:any)  => {
      if( data.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:data.data }, false, '300px', 'exito')
        return
      }
      const url = URL.createObjectURL(data.data);
      window.open(url, '_blank');
    })
    
  }
  async verDomicilio(){
   
    this.servicio.descargaComprobante( this.dataModal[0][0].Comprobante_domicilio )
    .then( (data:any) => {
      if( data.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:data.data }, false, '300px', 'exito')
        return
      }
      const url = URL.createObjectURL(data.data);
      window.open(url, '_blank');
    } )
    
  }
  verContrato(){
    console.log('contrato')
    // -----------------queda peidniente porque aun no se tiene el machote del cocumento ---------------------
  }
}