import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { Reportes } from '../../../core/services/Reportes.service';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { formatCurrency } from '@angular/common';

import { ReportesIndividual1 } from '../../../core/reportes/inversion/ReportesIndividual1';
import { ReportesGlobalInmobiliario1 } from '../../../core/reportes/ReporteInmobiliario/ReportesGlobal1';
// import { ReportesGlobal1 } from '../../../core/reportes/inversion/ReportesGlobal1';
// import { ReportesCatalogo1 } from '../../../core/reportes/inversion/ReportesCatalogo1';
// import { ReportesIndividualDivisas1 } from '../../../core/reportes/ReporteDivisas/ReportesIndividual1';
// import { ReportesIndividualPresupuesto1 } from '../../../core/reportes/ReportePresupuesto/ReportesIndividual1';
// import { ReportesIndividualFacturacion1 } from '../../../core/reportes/ReporteFacturacion/ReportesIndividual1';
// import { ReportesGlobalInmobiliarioICPC1 } from '../../../core/reportes/ReporteInmobiliario/ReportesICPC1';
// import { ReportesGlobalIngresos1 } from '../../../core/reportes/ReporteNoReconocido/ReportesGlobalIngresos1';
// import { ReportesGlobalPrestamos1 } from '../../../core/reportes/ReporteNoReconocido/ReportesGlobalPrestamos1';


let BusquedaID: Array<any>[] = [];

@Component({
  selector: 'app-reportes-Individuales',
  imports: [ReactiveFormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesIndividualesComponent implements OnInit {

  constructor(
    public puenteData:PuenteDataService,
    private servicio:Reportes,
    private reporteIndividualInversion1:ReportesIndividual1,
    // private reporteGlobalInversion1:ReportesGlobal1,
    // private reporteCatalogoInversion1:ReportesCatalogo1,

    // private reporteIndividualDivisas1:ReportesIndividualDivisas1,
    // private reportesIndividualPresupuesto1:ReportesIndividualPresupuesto1,
    // private reportesIndividualFacturacion1:ReportesIndividualFacturacion1,
    private reportesGlobalInmobiliario1:ReportesGlobalInmobiliario1,
    // private reportesGlobalInmobiliarioICPC1:ReportesGlobalInmobiliarioICPC1,
    // private reportesGlobalIngresos1:ReportesGlobalIngresos1,
    // private reportesGlobalPrestamos1:ReportesGlobalPrestamos1,
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
reporte: string='';

inversion:boolean = true;
divisas:boolean = true;
presupuesto:boolean = true;
facturacion:boolean = true;
inmobiliario:boolean = true;
noReconocidos:boolean = true;

private readonly _modalMsg = inject(ModalMsgService);
private readonly _dialog = inject(MatDialog);
// ------------------------------------------
// -------Variables Formulario---------------
  formulario = signal<FormGroup>(
    new FormGroup({

      Id_ICPC: new FormControl( '', [Validators.required] ),  
      fechaInicial: new FormControl( '', [Validators.required] ),
      fechaFin: new FormControl( '' ,[Validators.required] ),
      tipoReporte: new FormControl( 'Individual' ), // Individual , Global
      usuario: new FormControl( '' ), // usuario que que accede a la plataforma
      Id_Modelo: new FormControl( '',[Validators.required] ),
      check1: new FormControl( '', [Validators.required] ),
      check2: new FormControl( '', [Validators.required] ),

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
    this.puenteData.disparadorData.emit({ dato: 'Reportes Individuales', poisionX: '' })
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
resetForm(MN:boolean = false) {

  this.formulario().patchValue({
    ['Id_ICPC']:'',
    ['fechaInicial']:'',
    ['fechaFin']:'',
    ['tipoReporte']:'Individual',
    ['usuario']:'',
    // ['Id_Modelo']:'',
    ['check1']:'',
    ['check2']:'',
  });

  if(MN){
    this.formulario().patchValue({['Id_Modelo']:'',})
  }

    this.inversion = true;
    this.divisas = true;
    this.presupuesto = true;
    this.facturacion = true;
    this.inmobiliario = true;
    this.noReconocidos = true;

    this.inputINV.nativeElement.value = '';
    this.nombreInversionista = '';

    this.reporte = '';

    this.iframe.nativeElement.src = "" 

}

evaluaModelo( event:any ){
this.resetForm()
this.reporte = event.target.value
switch (event.target.value) {
  case '6':
    //Inversion
    this.inversion = false
    this.inmobiliario = true
    break;
    case '11':
      //Inmobiliario
    this.inversion = true
    this.inmobiliario = false
  break;
}

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

ver(){
    
    console.log(this.formulario().value)
  }

evaluaCheck1(event:any){
 
  
  if(event.target.checked == true && this.formulario().get('check1')?.value == ''){
    
    this.formulario().patchValue({ ['check1']:false })
    
  }
  
  if(event.target.checked == false && this.formulario().get('check1')?.value == false){
    
    this.formulario().patchValue({ ['check1']:'',['check2']:'' })
    
  }
  
}

evaluaCheck2(event:any){

  
  if(event.target.checked == true && this.formulario().get('check2')?.value == ''){
    
    this.formulario().patchValue({ ['check2']:false })
    
  }
  if(event.target.checked == false && this.formulario().get('check2')?.value == false){
      
    this.formulario().patchValue({ ['check1']:'',['check2']:'' })
    
  }


}

async enviar() {

  if (this.formulario().valid) {

    // if(  )
    
    if( this.formulario().get('usuario')?.value ===''){
      let credenciales = await this.servicio.GetCredenciales()
      this.formulario().patchValue({usuario:credenciales.Id})
    }
    
    let registro = await this.servicio.ReporteIndividual( this.formulario() )
    if ( registro.status === 'error' ){
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
      return
    }
    console.log(registro)
    switch (this.reporte) {
      case '6':
      this.reporteIndividualInversion1.genera(registro.data, this.iframe)
        break;
        case '11':
          this.reportesGlobalInmobiliario1.genera(registro.data, this.iframe)
      break;
    }

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

  }

// ------------------------------------------
// --------------- Reportes -----------------




  Reporte1(){
    // this.reporteIndividualInversion1.genera(this.array, this.iframe)
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
