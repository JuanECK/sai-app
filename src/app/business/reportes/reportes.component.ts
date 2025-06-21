import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalMsgService } from '../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { PuenteDataService } from '../../core/services/puente-data.service';
import { Reportes } from '../../core/services/Reportes.service';
import { ModalMsgComponent } from '../../core/modal-msg/modal-msg.component';
import { formatCurrency } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { ReportesIndividual1 } from '../../core/reportes/inversion/ReportesIndividual1';
import { ReportesGlobal1 } from '../../core/reportes/inversion/ReportesGlobal1';
import { ReportesCatalogo1 } from '../../core/reportes/inversion/ReportesCatalogo1';
import { ReportesIndividualDivisas1 } from '../../core/reportes/ReporteDivisas/ReportesIndividual1';
import { ReportesIndividualPresupuesto1 } from '../../core/reportes/ReportePresupuesto/ReportesIndividual1';
import { ReportesIndividualFacturacion1 } from '../../core/reportes/ReporteFacturacion/ReportesIndividual1';
import { ReportesGlobalInmobiliario1 } from '../../core/reportes/ReporteInmobiliario/ReportesGlobal1';
import { ReportesGlobalInmobiliarioICPC1 } from '../../core/reportes/ReporteInmobiliario/ReportesICPC1';
import { ReportesGlobalIngresos1 } from '../../core/reportes/ReporteNoReconocido/ReportesGlobalIngresos1';
import { ReportesGlobalPrestamos1 } from '../../core/reportes/ReporteNoReconocido/ReportesGlobalPrestamos1';

let BusquedaID: Array<any>[] = [];

@Component({
  selector: 'app-reportes',
  imports: [ReactiveFormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {

  constructor(
    public puenteData:PuenteDataService,
    private servicio:Reportes,
    private reporteIndividualInversion1:ReportesIndividual1,
    private reporteGlobalInversion1:ReportesGlobal1,
    private reporteCatalogoInversion1:ReportesCatalogo1,

    private reporteIndividualDivisas1:ReportesIndividualDivisas1,
    private reportesIndividualPresupuesto1:ReportesIndividualPresupuesto1,
    private reportesIndividualFacturacion1:ReportesIndividualFacturacion1,
    private reportesGlobalInmobiliario1:ReportesGlobalInmobiliario1,
    private reportesGlobalInmobiliarioICPC1:ReportesGlobalInmobiliarioICPC1,
    private reportesGlobalIngresos1:ReportesGlobalIngresos1,
    private reportesGlobalPrestamos1:ReportesGlobalPrestamos1,
    // public doc:jsPDF
  ){}

 // -------Variables de referencia-----------
@ViewChild('inputINV') inputINV!: ElementRef;
@ViewChild('nombreInv') nombreInv!: ElementRef;
@ViewChild('iframe') iframe!: ElementRef;
// ------------------------------------------
// -------Variables de entorno---------------
Hoy: string = "";
array: Array<any>[] = [];
input_BRK: boolean = false;
nombreInversionista: string='';
private readonly _modalMsg = inject(ModalMsgService);
private readonly _dialog = inject(MatDialog);
// ------------------------------------------
// -------Variables Formulario---------------
  formulario = signal<FormGroup>(
    new FormGroup({
      
      Id_Fondeo: new FormControl( '' ),
      id_cuentaB: new FormControl( '' ,[Validators.required] ),
      monto: new FormControl( '' ,[Validators.required] ),
      Fecha_Vencimiento: new FormControl( '' ,[Validators.required] ),
      usuario: new FormControl( '' ),

    })
  )
// ------------------------------------------
// -------Procedimientos de inicio-----------
  ngOnInit(): void {
    this.setDataLogin();
    this.cargaDataInicial();
    this.Hoy = this.fechaActual();
  }
  async cargaDataInicial(){
    this.array = await this.servicio.GetDataInicial();
  }
  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Reportes', poisionX: '' })
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
  soloDigito(event:any) {
    let valorMonto = event.target.value;
    valorMonto = valorMonto
    .replace(/\D/g, "")
    event.target.value = valorMonto 
  }
// ------------------------------------------
// ------- Procedimientos Generales----------
resetForm() {

  this.formulario().patchValue({
    ['Id_Fondeo']:'',
    ['id_cuentaB']:'',
    ['monto']:'',
    ['usuario']:'',
  });

}



getCurrencyAbono(event: any) {
  let value = event.target.value
  let returnvalor = value
  if (value != '') {
    returnvalor = formatCurrency(+value, 'en', '', '', '1.2-4')
    this.formulario().patchValue({ ['monto']: returnvalor.replace(/[^0-9.]/g, "") })
    event.target.value = returnvalor
    return
  }
  this.formulario().patchValue({ ['monto']: '' })
  event.target.value = returnvalor
}
// ------------------------------------------
// ------- Procedimientos de Caed 1----------
async enviar() {

  console.log(this.formulario().value)
    if (this.formulario().valid) {

      if( this.formulario().get('usuario')?.value ===''){
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({usuario:credenciales.Id})
      }

      let registro = await this.servicio.AgregarMovPresupuesto( this.formulario() )
      if ( registro.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
        return
      }
      
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'exito' )
      this.resetForm()
    }

}
  async busquedaInversionista( event:any ){
    if( this.inputINV.nativeElement.value == "" ){
      return
    }
    let lista = await this.servicio.busquedaInversionista( 'INV-'+this.inputINV.nativeElement.value )
    console.log(lista)

    if( lista[0].Resultado == "Sindatos" ){
      this.nombreInversionista = 'Sin coincidencias'
      this.nombreInv.nativeElement.classList.add('nombreSinCoincidencias')
      return
    }
    this.nombreInv.nativeElement.classList.remove('nombreSinCoincidencias')
    this.nombreInversionista = lista[0][0].Nombre_Razon_Social
    this.formulario().patchValue({['Id_ICPC']:lista[0][0].Id_ICPC})
    console.log(this.nombreInversionista)
    
  }

// ------------------------------------------
// --------------- Reportes -----------------




  Reporte1(){
    this.reporteIndividualInversion1.genera(this.array, this.iframe)
      // this.reporteGlobalInversion1.genera(this.array, this.iframe)
      // this.reporteCatalogoInversion1.genera(this.array, this.iframe)

      // this.reporteIndividualDivisas1.genera(this.array, this.iframe)
      // this.reportesIndividualPresupuesto1.genera(this.array, this.iframe)
      // this.reportesIndividualFacturacion1.genera(this.array, this.iframe)
      // this.reportesGlobalInmobiliario1.genera(this.array, this.iframe)
      // this.reportesGlobalInmobiliarioICPC1.genera(this.array, this.iframe)
      // this.reportesGlobalIngresos1.genera(this.array, this.iframe)
      // this.reportesGlobalPrestamos1.genera(this.array, this.iframe)
  }
  Reporte3(){
  }


// ------------------------------------------
}
