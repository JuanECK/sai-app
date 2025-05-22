import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import { Dialog, DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
// import { Comisionistas } from "../../../core/services/comisionistas.service";
import { blob } from "stream/consumers";
import { ModalMsgService } from "../../../core/services/modal-msg.service";
import { ModalMsgComponent } from "../../../core/modal-msg/modal-msg.component";
import { Inversionistas } from "../../../core/services/inversionistas.service";

@Component({
  selector: 'Ventana-Ver-Informacion-Proveedor',
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
                @for( item of dataModal; track $index ){
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">Nombre</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.nombre}}</td>
                  </tr>
                  <tr>
                    <th class="thead-th-blod-No-Border ">Tipo de persona</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.fisica_moral === '1' ? 'Fisica':'Moral'}}</td>
                  </tr>
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">RFC</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.RFC}}</td>
                  </tr>
                  <tr>
                    <th class="thead-th-blod-No-Border ">Actividad comercial</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.actividad}}</td>
                  </tr>
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">No de cuenta</th>
                    <td class="tbody-td-ligth-No-Border ">{{noCuenta}}</td>
                  </tr>
                  <tr>
                    <th class="thead-th-blod-No-Border ">Institución bancaria</th>
                    <td class="tbody-td-ligth-No-Border ">{{instBancaria}}</td>
                  </tr>
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">No. de proveedor</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.Num_Proveedor}}</td>
                  </tr>
                }
                
              </tbody>
            </table>
          </div>
        </div>
        <!-- <div class="btn-options">
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
        </div> -->
      </div>
  `,
  styleUrl: './cdk-Informacion-style.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VentanaVerInformacionProveedor implements OnInit {
  constructor(
    public servicio: Inversionistas
  ){}
  
  public readonly dataModal = inject(DIALOG_DATA);
  private readonly _modalMsg = inject(ModalMsgService)
  // data = this.dataModal.data.data

  noCuenta:string = '';
  instBancaria:string = '';
  
  ngOnInit(): void {
    console.log( this.dataModal)
    this.revisarCuentas()
  }

  revisarCuentas(){
    if(this.dataModal[0].Banco_Tarjeta){
      this.noCuenta = this.formatDigito(this.dataModal[0].tarjeta, 4)
      this.instBancaria = this.dataModal[0].Banco_Tarjeta
      return
    }
    if(this.dataModal[0].Banco_cuenta){
      this.noCuenta = this.formatDigito(this.dataModal[0].CLABE, 3)
      this.instBancaria = this.dataModal[0].Banco_cuenta
      return
    }
  }

  async verIdentificacion(){
    this.servicio.descargaComprobante( this.dataModal[0].INE )
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
   
    this.servicio.descargaComprobante( this.dataModal[0].Comprobante_Domicilio )
    .then( (data:any) => {
      if( data.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:data.data }, false, '300px', 'exito')
        return
      }
      const url = URL.createObjectURL(data.data);
      window.open(url, '_blank');
    } )
    
  }
  formatDigito( digito:string, size:number ){
    let valorMonto = digito;
    switch (size) {
      case 3:
        valorMonto = valorMonto
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, " ");
      break
      case 4:
        valorMonto = valorMonto
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{4})+(?!\d)\.?)/g, ` `);
      break
    }
  return valorMonto  
}
  verContrato(){
    console.log('contrato')
    // -----------------queda peidniente porque aun no se tiene el machote del cocumento ---------------------
  }
}