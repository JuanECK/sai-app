import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Financiamiento } from '../../core/services/Financiamiento.service';
import { PuenteDataService } from '../../core/services/puente-data.service';
import { ModalMsgService } from '../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { ModalMsgComponent } from '../../core/modal-msg/modal-msg.component';
import { VentanaBusquedaFinanciamiento } from './ventanaBusquedaMov';
import { VentanaVerInformacionFinanciamiento } from './ventanaVerInformacionMov';
import { VentanaEstatusPrestamoFinanciamiento } from './ventanaEstatusPrestamos';
import { VentanaEliminaFinanciamiento } from './ventanaEliminar';

let BusquedaText = '';
let BusquedaID: Array<any>[] = [];

@Component({
  selector: 'app-financiamiento',
  imports: [ReactiveFormsModule],
  templateUrl: './financiamiento.component.html',
  styleUrl: './financiamiento.component.css'
})
export class FinanciamientoComponent implements OnInit {

    constructor(
    public puenteData: PuenteDataService,
    private servicio: Financiamiento,
  ) { }

  // -------Variables de referencia---
  @ViewChild('Busqueda') Busqueda!: ElementRef;
  @ViewChild('Monto') Monto!: ElementRef;
  @ViewChild('TabsInformacion') TabsInformacion!: ElementRef;
  @ViewChild('FileIne') FileIne!: ElementRef;
  @ViewChild('inputIne') inputIne!: ElementRef;
  @ViewChild('FileContrato') FileContrato!: ElementRef;
  @ViewChild('inputContrato') inputContrato!: ElementRef;
  @ViewChild('FechaVencimiento') FechaVencimiento!: ElementRef;


  // ---------------------------------
  // -------Variables de entorno------
  criterioBusqueda: string = '';
  disabledBtn: any = true;
  listaBusqueda: Array<any>[] = [];
  arrayHistorico: Array<any>[] = [];
  array: Array<any>[] = [];
  editar: boolean = true;
  Hoy: string = "";
  comision:string = '$0.00 MXN'
  pik =  new Date().toISOString().split("T")[0];
  
  private readonly _modalMsg = inject(ModalMsgService);
  private readonly _dialog = inject(MatDialog);

  // ---------------------------------
  // -------Variables Formulario------
  formulario = signal<FormGroup>(
    new FormGroup({

      Id_Mov_Fin: new FormControl(''),

      Id_ICPC: new FormControl('',[Validators.required]),
      Monto: new FormControl('',[Validators.required]),
      Interes: new FormControl('',[Validators.required]),
      Comision: new FormControl(''),
      Fecha_Vencimiento: new FormControl('',[Validators.required]),
      INE: new FormControl(''),
      Contrato: new FormControl(''),
      Observaciones: new FormControl(''),
      usuario: new FormControl(''),

      estatus_pagado: new FormControl(''),
      estatus: new FormControl(''),

      // Id_ICPC: new FormControl( '' ,[Validators.required] ),

      comprobanteINE: new FormControl( '' ),
      comprobanteContrato: new FormControl( '' ),
      
      eliminadoINE: new FormControl( '' ),
      eliminadoContrato: new FormControl( '' ),

    })
  )

  // ---------------------------------
  
  // -------Procedimientos de inicio------
  ngOnInit(): void {
    this.setDataLogin();
    this.cargaHistorico();
    this.cargaDataInicial();
    this.Hoy = this.fechaActual();
    // this.FechaVencimiento.nativeElement.min = new Date().toISOString().split("T")[0];

  }
  
  async cargaDataInicial(){
    this.array = await this.servicio.GetDataInicial();
  }

  async cargaHistorico() {
    this.arrayHistorico = await this.servicio.getHistorico();

  }
  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Financiamiento', poisionX: '' })
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

  uploadIne(event: any) {
    if (event.target.files[0] === undefined) return

    if (event.target.files[0].size > 1 * 1024 * 1024) {
      let data = { mensaje: `Tamaño de archivo excedido: ${this.bytesToSize(event.target.files[0].size)}, !!Solo se admiten archivos de 1MB` };
      this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, false, '300px', 'error');
      this.FileIne.nativeElement.value = "";
      return
    }

    document.getElementById("boxNameCargaIne")?.classList.remove('disabledBox')
    this.formulario().patchValue({ INE: event.target.files[0], comprobanteINE:event.target.files[0].name });
    this.inputIne.nativeElement.value = event.target.files[0].name;

    if( BusquedaID ){
      if( BusquedaID[0][0].INE != '' ){
        if( BusquedaID[0][0].INE != this.formulario().get('comprobanteINE')?.value ){
          this.formulario().patchValue({ eliminadoINE:BusquedaID[0][0].INE });
        }
      }
    }

}
  uploadContrato(event: any):void {

    if (event.target.files[0] === undefined) return

    if (event.target.files[0].size > 1 * 1024 * 1024) {
      // let data = { mensaje: `Tamaño de archivo excedido: ${this.bytesToSize(event.target.files[0].size)}, !!Solo se admiten archivos de 1MB` };
      // this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, false, '300px', 'error');
      this.FileContrato.nativeElement.value = "";
      return
    }

    document.getElementById("boxNameCargaContrato")?.classList.remove('disabledBox')
    this.formulario().patchValue({ Contrato: event.target.files[0], comprobanteContrato:event.target.files[0].name });
    this.inputContrato.nativeElement.value = event.target.files[0].name;

    if( BusquedaID ){
      if( BusquedaID[0][0].Contrato != '' ){
        if( BusquedaID[0][0].INE != this.formulario().get('comprobanteContrato')?.value ){
          this.formulario().patchValue({ eliminadoContrato:BusquedaID[0][0].Contrato });
        }
      }
    }

  }

  ver(){
    console.log(this.formulario().value)
  }


  // ---------------------------------
  // ------- Procedimientos Generales------
bytesToSize(bytes: number, decimals: number = 2): string {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

eliminarBoxContrato() {
  // this.formulario().patchValue({ comprobanteContrato:'' });
  this.formulario().patchValue({ eliminadoContrato:"" });
  this.eliminarBoxFile('boxNameCargaContrato', this.inputContrato, this.FileContrato, 'Contrato')
}

eliminarBoxIne() {
  // this.formulario().patchValue({ comprobanteINE:'' });
  this.formulario().patchValue({ eliminadoINE:"" });
  this.eliminarBoxFile('boxNameCargaIne', this.inputIne, this.FileIne, 'INE')
}

eliminarBoxFile(HTMLElementBoxWho: string, HTMLElementRefFileHow: ElementRef, ElementRefHow: ElementRef, FormGroupNameKey: string) {
  document.getElementById(HTMLElementBoxWho)?.classList.add('disabledBox')
  HTMLElementRefFileHow.nativeElement.value = "";
  ElementRefHow.nativeElement.value = "";
  this.formulario().patchValue({ [FormGroupNameKey]: '' })
}
resetForm() {
  this.formulario().patchValue({

    ['Id_Mov_Fin']:'',
    ['Id_ICPC']:'',
    ['Monto']:'',
    ['Interes']:'',
    ['Comision']:'',
    ['Fecha_Vencimiento']:'',
    ['INE']:'',
    ['Contrato']:'',
    ['Observaciones']:'',
    ['usuario']:'',
    ['estatus_pagado']:'',
    ['estatus']:'',

    ['comprobanteINE']:'',
    ['comprobanteContrato']:'',
    ['eliminadoINE']:'',
    ['eliminadoContrato']:'',

  });
  this.editar = true
  this.FechaVencimiento.nativeElement.value = "";
  this.comision = '$0.00 MXN'

  this.eliminarBoxContrato() 
  this.eliminarBoxIne()
  // this.switchbtn.nativeElement.checked = false;
}
  cargaFormulario(form: Array<any>) {
    
    form[0].map((item: any) => {
      this.formulario().patchValue({

        ['Id_Mov_Fin']:item.Id_Mov_Fin,
        ['Id_ICPC']:item.Id_ICPC,
        ['Monto']:item.Monto,
        ['Interes']:item.Interes,
        ['Comision']:item.Comision,
        ['Fecha_Vencimiento']:item.Fecha_Vencimiento,
        ['INE']:item.INE == null ? '' : item.INE ,
        ['Contrato']:item.Contrato == null ? '' : item.Contrato,
        ['Observaciones']:item.Observaciones,
        // ['usuario']:item.usuario,
        ['estatus_pagado']:item.estatus_pagado,
        ['estatus']:item.estatus,

        ['comprobanteINE']:item.INE,
        ['comprobanteContrato']:item.Contrato,
        
      })
    })
    this.comision = `${formatCurrency(form[0][0].Comision, 'en', '$', '', '1.2-4')} MXN` 
    this.Monto.nativeElement.value = this.getCurrency(form[0][0].Monto)
    
    if(form[0][0].Contrato){
      document.getElementById("boxNameCargaContrato")?.classList.remove('disabledBox')
      this.inputContrato.nativeElement.value = form[0][0].Contrato;
    }
    if(form[0][0].INE){
      document.getElementById("boxNameCargaIne")?.classList.remove('disabledBox')
      this.inputIne.nativeElement.value = form[0][0].INE;
    }

  }
  getCurrency(value: number) {
    return formatCurrency(value, 'en', '', '', '1.2-4')
    // return formatCurrency(value, 'en', '$', '', '1.2-4')
  }



  // ---------------------------------
  // ------- Procedimientos de pantalla 1------

  // evaluaEstatusPagado( event:any ){
  //   if(event.target.checked){
  //     this.formulario().patchValue({['Estatus_Pagado']:'0'})
  //     return
  //   }
  //   this.formulario().patchValue({['Estatus_Pagado']:'1'})
  // }


  getCurrencySaldo(event: any) {
    let value = event.target.value
    let returnvalor = value
    if (value != '') {
      returnvalor = formatCurrency(+value, 'en', '', '', '1.2-4')
      this.formulario().patchValue({ ['Monto']: returnvalor.replace(/[^0-9.]/g, "") })
      event.target.value = returnvalor
      this.calculaComision()
      return
    }
    this.formulario().patchValue({ ['Monto']: 0 })
    event.target.value = returnvalor
  }

  calculaComision(){
    if(this.formulario().get('Monto')?.value == '' || this.formulario().get('Interes')?.value == ''){
      return
    }
    let monto = this.formulario().get('Monto')?.value;
    let interes = this.formulario().get('Interes')?.value;
    let calculo = monto * interes;
    this.comision = `${formatCurrency(calculo, 'en', '$', '', '1.2-4')} MXN`
    this.formulario().patchValue({ ['Comision']:this.comision.replace(/[^0-9.]/g, "")})
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


async enviar() {
    if (this.formulario().valid) {

      if( this.formulario().get('usuario')?.value ==='' || this.formulario().get('usuario')?.value == null){
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({usuario:credenciales.Id})
      }

      let registro = await this.servicio.AgregarFinanciamiento( this.formulario() )
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

      if( this.formulario().get('usuario')?.value == ''){
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


  // ---------------------------------
  // ------- Procedimientos de Historico------
   getCurrencyTable(value: number) {
      // return formatCurrency(value, 'en', '', '', '1.2-4')
      return formatCurrency(value, 'en', '$', '', '1.2-4')
  }
   formatoFechaLatina( fecha:string ){

    let d, m,  a , res
    if(fecha != ''){
      d = fecha.slice(8, 10)
      m = fecha.slice(5, 7)
      a = fecha.slice(0, 4)
      res = d+'-'+m+'-'+a
    }
    return res
  }

  async cambiarEstadoPrestamo(id: number){

      const dialogRef = this._dialog.open(VentanaEstatusPrestamoFinanciamiento, {
        disableClose: true,
        data: id,
        width: '300px',
        maxWidth: '100%',
      })
  
      dialogRef.afterClosed().subscribe(result => {
      if(result){
          this.servicio.prestamoPagado( id )
          .then( respuesta => {
          
            if (respuesta.status == 'error') {
              this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: respuesta.data }, false, '300px', 'error')
              return
            }

            this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: respuesta.data }, false, '300px', 'exito')

            console.log(id)
            this.cargaHistorico();
          } )

      }
      })

  }

  editaroMov(id: number) {

    const dialogRef = this._dialog.open(VentanaBusquedaFinanciamiento, {
      disableClose: true,
      data: '',
      width: '450px',

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.cargaFinanciamientoId(id)
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
  async eliminaroMov(id: number) {

    const dialogRef = this._dialog.open(VentanaEliminaFinanciamiento, {
      disableClose: true,
      data: '',
      width: '300px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.GetCredenciales()
          .then(credenciales => {

            this.servicio.eliminaFinanciamiento(id, '0', credenciales.Id)
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
    async verDatosoId(id: number) {
  
       const datos = await this.servicio.cargaFinanciamientoId( id )
  
      if(datos.status === 'error'){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
        return
      }
  
       const dialogRef = this._dialog.open(VentanaVerInformacionFinanciamiento, {
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
