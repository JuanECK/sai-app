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
import { Inmobiliario } from "../../../core/services/movInmobiliario.service";

@Component({
  selector: 'Ventana-Ver-Informacion-MovComisiones',
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
                  <tr class="">
                    <th class="thead-th-blod-No-Border ">Modelo de negocio</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.Modelo}}</td>
                  </tr>
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">Comisionista</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.Comisionista}}</td>
                  </tr>
                  <tr class="">
                    <th class="thead-th-blod-No-Border ">Monto</th>
                    <td class="tbody-td-ligth-No-Border ">{{getCurrency(item.Comision)}}</td>
                  </tr>
                  <tr class="trGris">
                    <th class="thead-th-blod-No-Border ">Cuenta asociada</th>
                    <td class="tbody-td-ligth-No-Border ">{{item.alias}}</td>
                  </tr>
                  <tr class="">
                    <th class="thead-th-blod-No-Border ">Fecha</th>
                    <td class="tbody-td-ligth-No-Border ">{{formatoFechaLatina(item.Fecha)}}</td>
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
      </div>
  `,
  styleUrl: './cdk-ventana-style.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VentanaVerInformacionMovComisiones implements OnInit {
  constructor(
    public servicio: Inmobiliario
  ) { }

  public readonly dataModal = inject(DIALOG_DATA);
  private readonly _modalMsg = inject(ModalMsgService)
  // data = this.dataModal.data.data
  direccion: string = '';

  ngOnInit(): void {
    // console.log(this.dataModal)

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

}