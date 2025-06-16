import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { Eliminados } from '../../../core/services/movEliminados.service';
import { MatDialog } from '@angular/material/dialog';
import { VentanaRestauraEliminados } from './ventanaRestaurarEliminados';
import { formatCurrency } from '@angular/common';

let BusquedaText = '';

@Component({
  selector: 'app-eliminados',
  imports: [],
  templateUrl: './eliminados.component.html',
  styleUrl: './eliminados.component.css'
})
export class EliminadosComponent implements OnInit {

  constructor(
    public puenteData: PuenteDataService,
    private servicio: Eliminados,
  ) { }

  // -------Variables de referencia---
  @ViewChild('Busqueda') Busqueda!: ElementRef;
  @ViewChild('TabsInformacion') TabsInformacion!: ElementRef;

  // ---------------------------------
  // -------Variables de entorno------
  criterioBusqueda: string = '';
  arrayHistorico: Array<any>[] = [];
  listaBusqueda: Array<any>[] = [];
  disabledBtn: any = true;
  Hoy: string = "";

  private readonly _modalMsg = inject(ModalMsgService);
  private readonly _dialog = inject(MatDialog);

  // ---------------------------------
  // -------Variables Formulario------


  // ---------------------------------
  // ------- Procedimientos Generales------


  // ---------------------------------
  // ------- Procedimientos de Historico------
  ngOnInit(): void {
    this.setDataLogin();
    this.cargaHistorico();
    this.Hoy = this.fechaActual();
  }

  async cargaHistorico() {
    this.arrayHistorico = await this.servicio.getHistorico();

  }
  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Eliminados', poisionX: '' })
  }

  fechaActual() {
    let fecha = '';
    var hoy = new Date();
    var ano = hoy.getFullYear();
    var mes = hoy.getMonth();
    var dia = hoy.getDate();
    var getMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return fecha = dia + ' / ' + getMes[mes] + ' / ' + ano
  }

  getCurrencyTable(value: number) {
    // return formatCurrency(value, 'en', '', '', '1.2-4')
    return formatCurrency(value, 'en', '$', '', '1.2-4')
  }

  formatoFechaLatina(fecha: string) {
    let d, m, a, res
    d = fecha.slice(8, 10)
    m = fecha.slice(5, 7)
    a = fecha.slice(0, 4)
    res = d + '-' + m + '-' + a
    return res
  }

  async RestaurarMov(id: number, tabla:string) {

    const dialogRef = this._dialog.open(VentanaRestauraEliminados, {
      disableClose: true,
      data: '',
      width: '400px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.GetCredenciales()
          .then(credenciales => {

            this.servicio.restauraEliminados(id, tabla, 1, credenciales.Id)
              .then(respuesta => {

                if (respuesta.status == 'error') {
                  this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: respuesta.data }, false, '300px', 'exito')
                  return
                }

                this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: respuesta.data }, false, '300px', 'exito')

                this.cargaHistorico();
                this.listaBusqueda = [];
                this.TabsInformacion.nativeElement.checked = true;
              })

          })

      }
    })

  }

  // ---------------------------------
  // ------- Procedimientos de Busqueda------
  inputBusqueda(event: any) {
    this.criterioBusqueda = event.target.value;
    // this.criterioBusqueda = ''; 
    if (event.target.value.length > 0) {
      this.disabledBtn = false;
      return
    }
    this.disabledBtn = true;
  }

  async busqueda() {
    BusquedaText = this.criterioBusqueda

    const data = await this.servicio.busqueda(this.criterioBusqueda)

    if (data.status === 'error') {

      this.listaBusqueda = []

      this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data.data }, false, '300px', 'exito')
      this.Busqueda.nativeElement.value = '';
      this.disabledBtn = true;
      return
    }
    this.listaBusqueda = data
    this.Busqueda.nativeElement.value = '';
    this.disabledBtn = true;
  }


  // ---------------------------------
}
