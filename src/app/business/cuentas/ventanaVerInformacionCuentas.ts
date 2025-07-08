import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import { Dialog, DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
// import { Comisionistas } from "../../../core/services/comisionistas.service";
import { blob } from "stream/consumers";
import { ModalMsgService } from "../../core/services/modal-msg.service";
import { ModalMsgComponent } from "../../core/modal-msg/modal-msg.component";
import { Inversionistas } from "../../core/services/inversionistas.service";
import { formatCurrency } from "@angular/common";

@Component({
  selector: 'Ventana-Ver-Informacion-Cuentas',
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
                    <th class="thead-th-blod-No-Border ">Clabe interbancaria</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.clabe}}</td>
                  </tr>
                  <tr>
                    <th class="thead-th-blod-No-Border ">No. de cuenta</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.noCuenta}}</td>
                  </tr>
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">No. de tarjeta</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.tarjeta}}</td>
                  </tr>
                  <tr>
                    <th class="thead-th-blod-No-Border ">Institución</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.nombreBanco}}</td>
                  </tr>
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">Moneda</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.moneda}}</td>
                  </tr>
                  <tr>
                    <th class="thead-th-blod-No-Border ">Modelo de Negocio</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.nombre_negocio}}</td>
                  </tr>
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">Alias de la cuenta</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.alias}}</td>
                  </tr>
                  <tr class="">
                    <th class="thead-th-blod-No-Border ">Saldo actual</th>
                    <td class="tbody-td-ligth-No-Border ">{{  getCurrency(item.saldoInicial)}}</td>
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

export class VentanaVerInformacionCuentas implements OnInit {
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

 getCurrency(value:number){
    return formatCurrency(value, 'en', '$', '','1.2-4')
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
    if(this.dataModal[0].FINCASH){
      this.noCuenta = this.formatDigito(this.dataModal[0].FINCASH, 4)
      this.instBancaria = 'FINCASH'
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