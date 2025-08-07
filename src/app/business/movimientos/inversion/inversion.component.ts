import { Component, ElementRef, EventEmitter, inject, OnInit, output, Output, signal, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { Inversion } from '../../../core/services/inversion.service';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { formatCurrency } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { movInvercion } from '../../../core/services/movInvercion.service';
import { VentanaVerInformacionMovInversion } from './ventanaVerInformacionMovInversion';
import { VentanaBusquedaMovInversion } from './ventanaBusquedaMovInversion';
import { VentanaEliminaMovInversion } from './ventanaEliminarCuentas';

let BusquedaText = '';
let BusquedaID: Array<any>[] = [];

@Component({
  selector: 'app-brk',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './inversion.component.html',
  styleUrl: './inversion.component.css'
})
export class InversionComponent implements OnInit {

  constructor(
    public puenteData: PuenteDataService,
    private servicio: movInvercion
  ) { }

  @ViewChild('Busqueda') Busqueda!: ElementRef;
  @ViewChild('nombreInv') nombreInv!: ElementRef;
  @ViewChild('FileComprobante') FileComprobante!: ElementRef;
  @ViewChild('inputComprobante') inputComprobante!: ElementRef;
  @ViewChild('inputINV') inputINV!: ElementRef;
  @ViewChild('Concepto') Concepto!: ElementRef;
  @ViewChild('radioBtn1') radioBtn1!: ElementRef;
  @ViewChild('radioBtn2') radioBtn2!: ElementRef;
  @ViewChild('Monto') Monto!: ElementRef;
  @ViewChild('TabsInformacion') TabsInformacion!: ElementRef;


  criterioBusqueda: string = '';
  disabledBtn: any = true;
  check: any = true;
  listaBusqueda: Array<any>[] = [];
  arrayHistorico: Array<any>[] = [];
  array: Array<any>[] = [];
  arrayCuenta: Array<any>[] = [];
  editar: boolean = true;
  Hoy: string = "";
  input_BRK: boolean = false;
  selectConcepto:boolean = true;
  selectCuenta:boolean = true;
  nombreInversionista: string='';
  reconocido: boolean = false;

  private readonly _modalMsg = inject(ModalMsgService);
  private readonly _dialog = inject(MatDialog);

  formulario = signal<FormGroup>(
    new FormGroup({

      Id_Mov_Inv: new FormControl( '' ),
      Id_ICPC: new FormControl( '',[Validators.required] ),
      Tipo_Movimiento: new FormControl( 'Ingreso' ),
      Id_CuentaB: new FormControl( '',[Validators.required] ),
      Monto: new FormControl( '',[Validators.required] ),
      Concepto: new FormControl( '',[Validators.required] ),
      Observaciones: new FormControl( '' ),
      Comprobante: new FormControl( '' ),
      usuario: new FormControl( '' ),
      estatus: new FormControl( '' ),
      
      comprobanteCambio: new FormControl( '' ),
       
    })
  )

  ngOnInit(): void {
    this.setDataLogin();
    this.cargaIngresoEgreso();
    this.cargaCuentaBancaria();
    this.cargaHistorico();
    this.Hoy = this.fechaActual();
  }

  async cargaIngresoEgreso(){
    this.array = await this.servicio.GetIngresoEgreso();
    // console.log(this.array)
  }
  async cargaCuentaBancaria(){
    this.arrayCuenta = await this.servicio.cargaCuentaBancaria();
    // console.log(this.arrayCuenta)
  }

  ver(){
    console.log(this.formulario().value)
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

  formatoFechaLatina( fecha:string ){
    let d, m,  a , res
    d = fecha.slice(8, 10)
    m = fecha.slice(5, 7)
    a = fecha.slice(0, 4)
    res = d+'-'+m+'-'+a
    return res
  }

  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Inversión', poisionX: '' })
  }

  evaluaCheck( num:number ){
    this.formulario().patchValue({['Concepto']:''})
    this.Concepto.nativeElement.value = '';
    this.selectConcepto = true;
    if(num === 1){
      this.formulario().patchValue({'Tipo_Movimiento':'Ingreso'})
      this.check = true
      return
    }
    if(num === 2){
      this.formulario().patchValue({'Tipo_Movimiento':'Egreso'})
      this.check = false
      return
    }

  }

  // insertaNumINV( event:any ){
  //   if( event.target.value === '' ){
  //     this.formulario().patchValue({['Id_CuentaB']:''})
  //     return
  //   }
  //   this.formulario().patchValue({['Id_CuentaB']:'INV-'+event.target.value})
  // }

  soloDigito(event:any) {
    let valorMonto = event.target.value;
    valorMonto = valorMonto
    .replace(/\D/g, "")
    event.target.value = valorMonto 
  }

  async optionCuenta(event: any) {
  if( event.target.selectedOptions[0].text.length > 16){
    this.selectCuenta = false
  }else{
    this.selectCuenta = true
  }
  // setTimeout(() => {
  //   this.mySelect.nativeElement.value = '';
  // }, 100)
}
  async optionConcepto(event: any) {
  if( event.target.selectedOptions[0].text.length > 16){
    this.selectConcepto = false
  }else{
    this.selectConcepto = true
  }
  // setTimeout(() => {
  //   this.mySelect.nativeElement.value = '';
  // }, 100)
}

    parseDigito2(event: any) {
    let cadena = event.target.value;
    let numPuntos = 0
    cadena = cadena
      .replace(/[^0-9.]/g, "");
    for (let i = 0; i < cadena.length; i++) {
      if (cadena[0] === '.') {
        cadena = cadena.slice(1)
      }
      if (cadena[i] === '.') {
        numPuntos++
        if (numPuntos > 1) {
          cadena = cadena.slice(0, i)
        }
      }
      if (cadena[i] === '.') {
        let res = cadena.slice(i, cadena.length)
        if (res.length > 5) {
          cadena = cadena.slice(0, cadena.length - 1)
        }
      }

    }
    event.target.value = cadena
  }

  async busquedaInversionista( event:any ){
    console.log(this.inputINV.nativeElement.value)
    if( this.inputINV.nativeElement.value == "" ){
      return
    }
    let lista = await this.servicio.busquedaInversionista( 'INV-'+this.inputINV.nativeElement.value )

    if( lista[0].Resultado == "Sindatos" ){
      this.nombreInversionista = 'Sin coincidencias'
      this.nombreInv.nativeElement.classList.add('nombreSinCoincidencias')
      return
    }
    this.nombreInv.nativeElement.classList.remove('nombreSinCoincidencias')
    this.nombreInversionista = lista[0].Nombre_Razon_Social
    this.formulario().patchValue({['Id_ICPC']:lista[0].Id_ICPC})
    console.log(lista)
    
  }
  getCurrencySaldo(event: any) {
    let value = event.target.value
    let returnvalor = value
    if (value != '') {
      returnvalor = formatCurrency(+value, 'en', '', '', '1.2-4')
      this.formulario().patchValue({ ['Monto']: returnvalor.replace(/[^0-9.]/g, "") })
      event.target.value = returnvalor
      return
    }
    this.formulario().patchValue({ ['Monto']: 0 })
    event.target.value = returnvalor
  }

  uploadComprobante(event: any) {
    if (event.target.files[0] === undefined) return

    if (event.target.files[0].size > 1 * 1024 * 1024) {
      let data = { mensaje: `Tamaño de archivo excedido: ${this.bytesToSize(event.target.files[0].size)}, !!Solo se admiten archivos de 1MB` };
      this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, false, '300px', 'error');
      this.FileComprobante.nativeElement.value = "";
      return
    }

    document.getElementById("boxNameComprobante")?.classList.remove('disabledBox')
    this.formulario().patchValue({ Comprobante: event.target.files[0] });
    this.inputComprobante.nativeElement.value = event.target.files[0].name;
}

eliminarBoxComprobante() {
  this.eliminarBoxFile('boxNameComprobante', this.inputComprobante, this.FileComprobante, 'Comprobante')
}

bytesToSize(bytes: number, decimals: number = 2): string {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

eliminarBoxFile(HTMLElementBoxWho: string, HTMLElementRefFileHow: ElementRef, ElementRefHow: ElementRef, FormGroupNameKey: string) {
  document.getElementById(HTMLElementBoxWho)?.classList.add('disabledBox')
  HTMLElementRefFileHow.nativeElement.value = "";
  ElementRefHow.nativeElement.value = "";
  this.formulario().patchValue({ [FormGroupNameKey]: '',['comprobanteCambio']:'' })
}

async enviar() {
    if (this.formulario().valid) {

      if( this.formulario().get('usuario')?.value ==='' || this.formulario().get('usuario')?.value == null){
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({usuario:credenciales.Id})
      }

      let registro = await this.servicio.AgregarMovInvercion( this.formulario() )
      if ( registro.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
        return
      }
      
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'exito' )
      this.resetForm()
      this.cargaHistorico();
      this.listaBusqueda = [];
    }

}

async ActualizarRegistro() {

    if ( this.formulario().valid ){

      // console.log( BusquedaID[0][0].Comprobante , ' - ' , this.formulario().get('Comprobante')?.value )

      // if (typeof this.formulario().get('Comprobante')?.value == "object") {
      //   this.formulario().patchValue({['comprobanteCambio']:''})
      // }
      // if( BusquedaID[0][0].Comprobante != null && this.formulario().get('Comprobante')?.value == "" ){
        this.formulario().patchValue({['comprobanteCambio']:BusquedaID[0][0].Comprobante,})
      // }
      
      console.log(this.formulario().value)

      if( this.formulario().get('usuario')?.value == null ){
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({usuario:credenciales.Id})
      }

      let registroActualizado = await this.servicio.EnviarActualizacio(this.formulario(), BusquedaID)

      if ( registroActualizado.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registroActualizado.data }, false, '300px', 'error' )
        return
      }

      if ( registroActualizado.status === 'edicion' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registroActualizado.data }, false, '300px', 'exito' )
        return
      }
      
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registroActualizado.data }, false, '300px', 'exito' )
      this.resetForm()
      this.cargaHistorico();
      this.listaBusqueda = [];
      this.TabsInformacion.nativeElement.checked = true;
    }
}

  // -------------------------------------------------------------------------------------

  async cargaHistorico() {
    this.arrayHistorico = await this.servicio.getHistorico();
    console.log(this.arrayHistorico)
  }

  getCurrency(value: number) {
    return formatCurrency(value, 'en', '', '', '1.2-4')
    // return formatCurrency(value, 'en', '$', '', '1.2-4')
  }
  getCurrencyTable(value: number) {
    // return formatCurrency(value, 'en', '', '', '1.2-4')
    return formatCurrency(value, 'en', '$', '', '1.2-4')
  }

  async verDatosoMovInversion(id: number) {

     const datos = await this.servicio.cargaMovInvercionId( id )

    if(datos.status === 'error'){
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
      return
    }

     const dialogRef = this._dialog.open(VentanaVerInformacionMovInversion, {
       disableClose: true,
       data: datos,
       width: '705px',
       maxWidth: '100%',
     })

     dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.cargaHistorico();
      }
     })

  }

  editaroMovInversion(id: number) {

    const dialogRef = this._dialog.open(VentanaBusquedaMovInversion, {
      disableClose: true,
      data: '',
      width: '450px',

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.cargaMovInvercionId(id)
          .then(datos => {
            if (datos.status === 'error') {
              this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: datos.data }, false, '300px', 'exito')
              return
            }
            this.resetForm()
            this.editar = false
            // this.cargaHistorico();
            BusquedaID = datos;
            this.cargaFormulario(datos)
          })
      }
    });

  }

    cargaFormulario(form: Array<any>) {

    console.log(form[0][0])
    form[0][0].Tipo_Movimiento === 'Ingreso' ? (this.radioBtn1.nativeElement.checked = true) : (this.radioBtn2.nativeElement.checked = true)
    
    form[0].map((item: any) => {
      this.formulario().patchValue({
        
        ['Id_Mov_Inv']:item.Id_Mov_Inv,
        ['Id_ICPC']:item.Id_ICPC,
        ['Tipo_Movimiento']:item.Tipo_Movimiento,
        ['Id_CuentaB']:item.Id_CuentaB,
        ['Monto']:item.Monto,
        ['Concepto']:item.Concepto,
        ['Observaciones']:item.Observaciones,
        ['Comprobante']:item.Comprobante,
        ['usuario']:item.usuario,
        ['estatus']:item.Estatus,
        
      })
    })
    
    let num = form[0][0].Tipo_Movimiento === 'Ingreso' ? 1 : 2;
    this.Monto.nativeElement.value = this.getCurrency(form[0][0].Monto)

    if(form[0][0].Comprobante){
      document.getElementById("boxNameComprobante")?.classList.remove('disabledBox')
      this.inputComprobante.nativeElement.value = form[0][0].Comprobante;
    }

    if(num === 1){
      this.check = true
      // return
    }
    if(num === 2){
      this.check = false
      // return
    }

    this.nombreInversionista = form[0][0].nombre

    if( form[0][0].reconocido == 1 ){
      this.Monto.nativeElement.disabled = true
      this.reconocido = true;
      this.radioBtn2.nativeElement.disabled = true
    }

  }

  async eliminaroMovInversion(id: number) {

    const dialogRef = this._dialog.open(VentanaEliminaMovInversion, {
      disableClose: true,
      data: '',
      width: '300px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.GetCredenciales()
          .then(credenciales => {

            this.servicio.eliminaObservacion(id, '0', credenciales.Id)
              .then(respuesta => {

                if (respuesta.status == 'error') {
                  this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: respuesta.data }, false, '300px', 'exito')
                  return
                }

                this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: respuesta.data }, false, '300px', 'exito')

                this.cargaHistorico();
                this.listaBusqueda = [];
              })

          })

      }
    })

  }

  // -------------------------------------------------------------------------
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
    console.log(data)
    this.listaBusqueda = [data]
    this.Busqueda.nativeElement.value = '';
    this.disabledBtn = true;
  }

  verDatosComisionista(id: number) {

  }
  editarComisionista(id: number) {

  }
  eliminarComisionista(id: number) {

  }

  resetForm() {
  this.eliminarBoxComprobante()
  this.selectCuenta = true;
  this.selectConcepto = true;
  this.formulario().patchValue({
    
    ['Id_Mov_Inv']:'',
    ['Id_ICPC']:'',
    ['Tipo_Movimiento']:'Ingreso',
    ['Id_CuentaB']:'',
    ['Monto']:'',
    ['Concepto']:'',
    ['Observaciones']:'',
    ['Comprobante']:'',
    ['usuario']:'',
    ['estatus']:'',
    
  });
  this.Monto.nativeElement.disabled = false
  this.inputINV.nativeElement.value = '';
  this.nombreInversionista = '';
  this.radioBtn1.nativeElement.checked = true
  this.radioBtn2.nativeElement.disabled = false
  this.reconocido = false
  this.editar = true
}


}
