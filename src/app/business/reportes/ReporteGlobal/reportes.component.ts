import { Component, ElementRef, inject, OnInit, signal, ViewChild, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { Reportes } from '../../../core/services/Reportes.service';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { formatCurrency } from '@angular/common';
import { ReportesIndividual1 } from '../../../core/reportes/inversion/ReportesIndividual1';
import { ReportesGlobal1 } from '../../../core/reportes/inversion/ReportesGlobal1';
import { ReportesCatalogo1 } from '../../../core/reportes/inversion/ReportesCatalogo1';
import { ReportesIndividualDivisas1 } from '../../../core/reportes/ReporteDivisas/ReportesIndividual1';
import { ReportesIndividualPresupuesto1 } from '../../../core/reportes/ReportePresupuesto/ReportesIndividual1';
import { ReportesIndividualFacturacion1 } from '../../../core/reportes/ReporteFacturacion/ReportesIndividual1';
import { ReportesGlobalInmobiliario1 } from '../../../core/reportes/ReporteInmobiliario/ReportesGlobal1';
import { ReportesGlobalInmobiliarioICPC1 } from '../../../core/reportes/ReporteInmobiliario/ReportesICPC1';
import { ReportesGlobalIngresos1 } from '../../../core/reportes/ReporteNoReconocido/ReportesGlobalIngresos1';
import { ReportesGlobalPrestamos1 } from '../../../core/reportes/ReporteNoReconocido/ReportesGlobalPrestamos1';
import { AuthUserActiveService } from '../../../core/services/authUserActive.service';



let BusquedaID: Array<any>[] = [];


@Component({
  selector: 'app-reportes-Globales',
  imports: [ReactiveFormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesGlobalesComponent implements OnInit {

  constructor(
private renderer: Renderer2,

    public puenteData:PuenteDataService,
    private servicio:Reportes,
    private authService:AuthUserActiveService,
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
@ViewChild('checkIE') checkIE!: ElementRef;
@ViewChild('checkCatalogo') checkCatalogo!: ElementRef;
@ViewChild('checkIngresos') checkIngresos!: ElementRef;
@ViewChild('checkPrestamo') checkPrestamo!: ElementRef;
@ViewChild('checkAbonos') checkAbonos!: ElementRef;
@ViewChild('checkIncrementos') checkIncrementos!: ElementRef;
@ViewChild('iframe') iframe!: ElementRef;
// ------------------------------------------
// -------Variables de entorno---------------
Hoy: string = "";
array: Array<any>[] = [];
input_BRK: boolean = false;
nombreInversionista: string='';
reporte: string='';
catalogo:boolean = false;
Ingresos:boolean = false;
Prestamos:boolean = false;
Abonos:boolean = false;
Incrementos:boolean = false;

dataLocalUrl:any

divisas:boolean = true;
facturacion:boolean = true;
inversiones:boolean = true
noReconocidos:boolean = true;
presupuesto:boolean = true;

private readonly _modalMsg = inject(ModalMsgService);
private readonly _dialog = inject(MatDialog);
// ------------------------------------------
// -------Variables Formulario---------------
  formulario = signal<FormGroup>(
    new FormGroup({

      Id_ICPC: new FormControl( 0 ),
      fechaInicial: new FormControl( '', [Validators.required] ),
      fechaFin: new FormControl( '' ,[Validators.required] ),
      tipoReporte: new FormControl( 'Global' ), // Individual , Global
      usuario: new FormControl( '' ), // usuario que que accede a la plataforma
      Id_Modelo: new FormControl( '',[Validators.required] ),
      check1: new FormControl( '', [Validators.required] ),
      check2: new FormControl( '', [Validators.required] ),

    })
  )

  formularioCatalogo = signal<FormGroup>(
    new FormGroup({

      Id_ICPC: new FormControl( 0 ),  
      fechaInicial: new FormControl( '' ),
      fechaFin: new FormControl( '' ),
      tipoReporte: new FormControl( 'Global' ), // Individual , Global
      usuario: new FormControl( '' ), // usuario que que accede a la plataforma
      Id_Modelo: new FormControl( '',[Validators.required] ),

    })
  )

// ------------------------------------------
// -------Procedimientos de inicio-----------
ngOnInit(): void {
  let iframe2 = document.getElementsByTagName("iframe")[0];
  this.setDataLogin();
    this.cargaDataInicial();
    this.Hoy = this.fechaActual();

      iframe2.contentWindow?.addEventListener('mousemove', () => {
          this.authService.simulateUserActivity();
          // console.log('iframe')
        });

  }

  async cargaDataInicial(){
    this.array = await this.servicio.GetDataInicialG();
  }
  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Reportes Globales', poisionX: '' })
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
    ['Id_ICPC']:0,
    ['fechaInicial']:'',
    ['fechaFin']:'',
    ['tipoReporte']:'Global',
    ['usuario']:'',
    // ['Id_Modelo']:'',
    ['check1']:'',
    ['check2']:'',
  });

  this.formularioCatalogo().patchValue({
    ['Id_ICPC']:0,
    ['fechaInicial']:'',
    ['fechaFin']:'',
    ['tipoReporte']:'Global',
    ['usuario']:'',
    ['Id_Modelo']:'',
  });

  if(MN){
    this.formulario().patchValue({['Id_Modelo']:'',})
  }

    this.divisas = true;
    this.facturacion = true;
    this.inversiones = true
    this.noReconocidos = true;
    this.presupuesto = true;

    // this.inputINV.nativeElement.value = '';
    this.nombreInversionista = '';

    this.reporte = '';
    this.iframe.nativeElement.src = "" 
    // this.gen()

    this.Prestamos = false;
    this.Ingresos = false;
    this.Abonos = false;
    this.Prestamos = false;

}

// gen(){
//   console.log('iframe33333')
//   let iframe2 = document.getElementsByTagName("iframe")[0];
//       iframe2.contentWindow?.addEventListener('mousemove', () => {
//           this.authService.simulateUserActivity();
//           console.log('iframe')
//       });
// }


evaluaModelo( event:any ){
this.resetForm()
this.reporte = event.target.value
switch (event.target.value) {
    case '1':
      //"Divisas"
      this.divisas = false;
      this.facturacion = true;
      this.inversiones = true
      this.noReconocidos = true;
      this.presupuesto = true;
      break;
    case '5':
      //"Facturación"
      this.divisas = true;
      this.facturacion = false;
      this.inversiones = true
      this.noReconocidos = true;
      this.presupuesto = true;
      break;
    case '6':
      //"Inversiones"
      this.divisas = true;
      this.facturacion = true;
      this.inversiones = false
      this.noReconocidos = true;
      this.presupuesto = true;
      this.formulario().patchValue({['fechaInicial']:null})
          
      break;
    case '14':
      //"No reconocido"
      this.divisas = true;
      this.facturacion = true;
      this.inversiones = true
      this.noReconocidos = false;
      this.presupuesto = true;
      
      break;
    case '16':
      //"Presupuesto"
      this.divisas = true;
      this.facturacion = true;
      this.inversiones = true
      this.noReconocidos = true;
      this.presupuesto = false;

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
async enviar() {

  let registro = null
  if (this.formulario().valid) {
    
    if( this.formulario().get('usuario')?.value ===''){
      let credenciales = await this.servicio.GetCredenciales()
      this.formulario().patchValue({usuario:credenciales.Id})
    }

    registro = await this.servicio.ReporteGlobal( this.formulario() )
    if ( registro.status === 'error' ){
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
      return
      
    }

      // ----------SWICH GLOBAL INGRESOS EGRESOS--------
       switch (this.reporte) {
        case '1':
          //"Divisas"

          // this.iframe.nativeElement.src = this.reporteIndividualDivisas1.genera(registro.data)

          this.reporteIndividualDivisas1.genera(registro.data, this.iframe)

          break;
          case '5':
            //"Facturación"
            this.reportesIndividualFacturacion1.genera(registro.data, this.iframe)
        break;
          case '6':
            //"Inversiones"
            console.log("Inversiones")
            this.reporteGlobalInversion1.genera(registro.data, this.iframe)

        break;
          case '14':
            //"No reconocido"
            if(this.Ingresos){
              console.log('ingresos')
              this.reportesGlobalIngresos1.genera(registro.data, this.iframe)
            }else if(this.Prestamos){
              console.log('prestamos')
              this.reportesGlobalPrestamos1.genera(registro.data, this.iframe)
            }

        break;
          case '16':
            //"Presupuesto"
            this.reportesIndividualPresupuesto1.genera(registro.data, this.iframe)
        break;

      }

    }
}
async enviarCatalogo() {

  let registro = null
  if (this.formularioCatalogo().valid) {
    
    if( this.formularioCatalogo().get('usuario')?.value ===''){
      let credenciales = await this.servicio.GetCredenciales()
      this.formularioCatalogo().patchValue({usuario:credenciales.Id})
    }
    

    registro = await this.servicio.ReporteGlobalCatalogo( this.formularioCatalogo() )
    
    if ( registro.status === 'error' ){
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
      return
      // }
      
    }
    
    console.log(this.formularioCatalogo().value)
    
      // ----------SWICH CATALOGO--------
       switch (this.reporte) {
        case '1':
          //"Divisas"

          break;
          case '5':
            //"Facturación"

        break;
          case '6':
            //"Inversiones"
            this.reporteCatalogoInversion1.genera(registro.data, this.iframe)

        break;
          case '14':
            //"No reconocido"

        break;
          case '16':
            //"Presupuesto"

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

/////////////////////////////////////////////////////////////  DIVISAS  /////////////////////////////////////////////////////////////////
divisasEvaluaCheck( event:any ){
  if(event.target.checked){
    this.formulario().patchValue({['check2']:true})
    return
  }
  this.formulario().patchValue({['check2']:''})
  
}

/////////////////////////////////////////////////////////////  FACTURACION  /////////////////////////////////////////////////////////////
facturacionEvaluaCheck( event:any ){
  if(event.target.checked){
    this.formulario().patchValue({['check2']:true})
    return
  }
  this.formulario().patchValue({['check2']:''})
  
}

/////////////////////////////////////////////////////////////  INVERSIONES  /////////////////////////////////////////////////////////////
inversionesEvaluaCheck( event:any ){
  this.checkCatalogo.nativeElement.checked = false;
  this.catalogo = false;
  this.formularioCatalogo().patchValue({
    ['Id_ICPC']:0,
    ['fechaInicial']:'',
    ['fechaFin']:'',
    ['tipoReporte']:'Global',
    ['usuario']:'',
    ['Id_Modelo']:'',
  });
  if(event.target.checked){
    this.formulario().patchValue({['check2']:true})
    return
  }
  setTimeout(()=>{
    this.formulario().patchValue({
      ['fechaInicial']:'',
      ['fechaFin']:'',
      ['check1']:'',
      ['check2']:'',
      ['usuario']:'',
    })
  },100)
  
}

inversionesCatalogoEvalua( event:any ){
if(event.target.checked){
  this.catalogo = true
  console.log(new Date().toISOString().split('T')[0])
    this.formularioCatalogo().patchValue({
    ['Id_ICPC']:0,
    ['fechaInicial']:new Date().toISOString().split('T')[0],
    ['fechaFin']:new Date().toISOString().split('T')[0],
    ['tipoReporte']:'Global',
    ['usuario']:'',
    ['Id_Modelo']:6,
  });
} else{
  this.catalogo = false
    this.formularioCatalogo().patchValue({
    ['Id_ICPC']:0,
    ['fechaInicial']:'',
    ['fechaFin']:'',
    ['tipoReporte']:'Global',
    ['usuario']:'',
    ['Id_Modelo']:'',
  });
}
  this.formulario().patchValue({
    ['fechaInicial']:'',
    ['fechaFin']:'',
    ['check1']:'',
    ['check2']:'',
    ['usuario']:'',
  })
  this.checkIE.nativeElement.checked = false;

}

/////////////////////////////////////////////////////////////  NO RECONOCIDOS  //////////////////////////////////////////////////////////

evaluaIngresos( event:any ){
  this.Ingresos = true;
  this.Prestamos = false;
  if(event.target.checked){
  this.checkPrestamo.nativeElement.checked = false
  this.formulario().patchValue({
    ['check2']:false,
    ['fechaInicial']:'',
    ['fechaFin']:'',
    ['usuario']:'',
  })
    return
  }
  setTimeout(()=>{
    this.formulario().patchValue({
    ['fechaInicial']:'',
    ['fechaFin']:'',
    ['check1']:'',
    ['check2']:'',
    ['usuario']:'',
    })
  },100)
}

evaluaPrestamo( event:any ){
  this.Prestamos = true;
  this.Ingresos = false;
  if(event.target.checked){
    this.checkIngresos.nativeElement.checked = false
    this.formulario().patchValue({
      ['check1']:false,
      ['fechaInicial']:'',
      ['fechaFin']:'',
      ['usuario']:'',
    })
    return
  }
  setTimeout(()=>{
    this.formulario().patchValue({
    ['fechaInicial']:'',
    ['fechaFin']:'',
    ['check1']:'',
    ['check2']:'',
    ['usuario']:'',
  })
  },100)
}

/////////////////////////////////////////////////////////////  PRESUPUESTO  /////////////////////////////////////////////////////////////

evaluaAbonos( event:any ){
  this.Abonos = true;
  this.Incrementos = false;
  if(event.target.checked){
  this.checkIncrementos.nativeElement.checked = false
  this.formulario().patchValue({
    ['check2']:false,
    ['fechaInicial']:'',
    ['fechaFin']:'',
    ['usuario']:'',
  })
    return
  }
  setTimeout(()=>{
    this.formulario().patchValue({
      ['fechaInicial']:'',
      ['fechaFin']:'',
      ['check1']:'',
      ['check2']:'',
      ['usuario']:'',
    })
  },100)
}

evaluaIncrementos( event:any ){
  this.Incrementos = true;
  this.Abonos = false;
  if(event.target.checked){
    this.checkAbonos.nativeElement.checked = false
    this.formulario().patchValue({
      ['check1']:false,
      ['fechaInicial']:'',
      ['fechaFin']:'',
      ['usuario']:'',
    })
    return
  }
  setTimeout(()=>{
    this.formulario().patchValue({
      ['fechaInicial']:'',
      ['fechaFin']:'',
      ['check1']:'',
      ['check2']:'',
      ['usuario']:'',
    })
  },100)
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ------------------------------------------
}

// (function(){
//    var moviendo= false;
//    document.onmousemove = function(){
//           moviendo= true;
//    };
//    setInterval (function() {
//       if (!moviendo) {
//         console.log('no se a movido')
//         // No ha habido movimiento desde hace un segundo, aquí tu codigo
//       } else {
//         console.log('movido')
//           moviendo=false;
//       }
//    }, 1000); // Cada segundo, pon el valor que quieras.
// })()

