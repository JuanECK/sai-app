import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import { Dialog, DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
// import { Comisionistas } from "../../../core/services/comisionistas.service";
import { blob } from "stream/consumers";
import { ModalMsgService } from "../../../core/services/modal-msg.service";
import { ModalMsgComponent } from "../../../core/modal-msg/modal-msg.component";
import { Inversionistas } from "../../../core/services/inversionistas.service";
import { formatCurrency } from "@angular/common";
import { movInvercion } from "../../../core/services/movInvercion.service";
import { Proveedor } from "../../../core/services/movProveedor.service";

@Component({
  selector: 'Ventana-Ver-Informacion-MovProvedor',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `

      <div class="content-modalMsg">
        <div class="titulo">
          <h1>Resumen de movimiento</h1>
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
                    <th class="thead-th-blod-No-Border ">Proveedor</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.nombre}}</td>
                  </tr>
                  <tr class="">
                    <th class="thead-th-blod-No-Border ">Concepto</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.concepto}}</td>
                  </tr>
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">Monto</th>
                    <td class="tbody-td-ligth-No-Border ">{{getCurrency(item.Monto)}}</td>
                  </tr>
                  <tr class="">
                    <th class="thead-th-blod-No-Border ">Cuenta</th>
                    <td class="tbody-td-ligth-No-Border ">{{formatDigito(item.clabe, 3)}}</td>
                  </tr>
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">Fecha de operación</th>
                    <td class="tbody-td-ligth-No-Border ">{{formatoFechaLatina(item.Fecha_Captura)}}</td>
                  </tr>
                }
              </tbody>
            </table>
              <div class="divObservaciones">
                <h4 class="">Observaciones</h4>
                <textarea class="observaciones" name="" id="" rows=0 cols=0 disabled="true" placeholder="Observaciones del movimiento">{{dataModal[0][0].Observaciones}}</textarea>
              </div>
          </div>
        </div>
        <div class="btn-options">
          <h2>Comprobantes de movimiento</h2>
          <p>Puedes visualizar e imprimir estos documentos</p>
          <div class="btn-acction">
            <div (click)="verComprobante()" class="btn-group">
              <img src="/img-sai/icon-comprobantedeDomicilio.png" alt="Comprobante de domicilio">
              <p>Comprobante</p>
            </div>
          </div>
        </div>
      </div>
  `,
  styleUrl: './cdk-ventana-style.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VentanaVerInformacionMovProvedor implements OnInit {
  constructor(
    public servicio: Proveedor
  ) { }

  public readonly dataModal = inject(DIALOG_DATA);
  private readonly _modalMsg = inject(ModalMsgService)
  // data = this.dataModal.data.data
  direccion: string = '';

  ngOnInit(): void {
    console.log(this.dataModal)

    // let calle = this.dataModal[0].Calle;
    // let NoExterior = this.dataModal[0].No_Exterior =='' ? '':', No. ' + this.dataModal[0].No_Exterior;
    // let colonia = this.dataModal[0].Colonia == '' ? '' : ', Col. ' + this.dataModal[0].Colonia
    // let CP = this.dataModal[0].CP == '' ? '' : ', CP. ' + this.dataModal[0].CP
    // let municipio = this.dataModal[0].Municipio == '' ? '' : ', ' + this.dataModal[0].Municipio
    // let estado = this.dataModal[0].Estado == '' ? '' : ', ' + this.dataModal[0].Estado

    // this.direccion = `${calle}${NoExterior}${colonia}${CP}${municipio}${estado}`; 

  }
  formatoFechaLatina( fecha:string ){
    let d, m,  a , res
    d = fecha.slice(8, 10)
    m = fecha.slice(5, 7)
    a = fecha.slice(0, 4)
    res = d+'-'+m+'-'+a
    return res
  }
  getCurrency(value: number) {
    return formatCurrency(value, 'en', '$', '', '1.2-4')
  }

  formatDigito(digito: string, size: number) {
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

  async verComprobante() {
console.log(this.dataModal[0][0].Comprobante)
    this.servicio.descargaComprobante(this.dataModal[0][0].Comprobante)
      .then((data: any) => {
        if (data.status === 'error') {
          this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data.data }, false, '300px', 'exito')
          return
        }
        const url = URL.createObjectURL(data.data);
        window.open(url, '_blank');
      })

  }
  verContrato() {
    console.log('contrato')
    // -----------------queda peidniente porque aun no se tiene el machote del cocumento ---------------------
  }
}