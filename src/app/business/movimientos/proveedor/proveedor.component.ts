import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { publicDecrypt } from 'crypto';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { Proveedor } from '../../../core/services/movProveedor.service';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { formatCurrency } from '@angular/common';
import { VentanaVerInformacionMovProvedor } from './ventanaVerInformacionMovProveedor';
import { VentanaBusquedaMovProveedor } from './ventanaBusquedaMovInversion';
import { VentanaEliminaMovProveedor } from './ventanaEliminarCuentas';

let BusquedaText = '';
let BusquedaID: Array<any>[] = [];

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css'
})
export class ProveedorComponent implements OnInit {

  constructor(
    public puenteData: PuenteDataService,
    private servicio: Proveedor,
  ) { }

  // -------Variables de referencia---
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



  // ---------------------------------
  // -------Variables de entorno------
  criterioBusqueda: string = '';
  disabledBtn: any = true;
  check: any = true;
  listaBusqueda: Array<any>[] = [];
  arrayHistorico: Array<any>[] = [];
  array: Array<any>[] = [];
  array1: Array<any>[] = [];
  array2: Array<any>[] = [];
  editar: boolean = true;
  Hoy: string = "";
  input_BRK: boolean = false;
  // selectProveedor: boolean = true;
  // selectConcepto: boolean = true;
  // selectCuenta: boolean = true;
  nombreInversionista: string = '';
  
  private readonly _modalMsg = inject(ModalMsgService);
  private readonly _dialog = inject(MatDialog);

  // ---------------------------------
  // -------Variables Formulario------
  formulario = signal<FormGroup>(
    new FormGroup({

      Id_Mov_Prov: new FormControl( '' ),
      Id_ICPC: new FormControl( '',[Validators.required] ),
      Id_CuentaB: new FormControl( '',[Validators.required]  ),
      Monto: new FormControl( '',[Validators.required]  ),
      Concepto: new FormControl( '',[Validators.required]  ),
      Observaciones: new FormControl( '' ),
      Comprobante: new FormControl( '' ),
      usuario: new FormControl( '' ),
      estatus: new FormControl( '' ),
      comprobanteCambio: new FormControl( '' ),
       
    })
  )



  // ---------------------------------
  
  // -------Procedimientos de inicio------
  ngOnInit(): void {
    this.setDataLogin();
    this.cargaHistorico();
    this.cargaDataInicial();
    this.Hoy = this.fechaActual();
  }
    async cargaDataInicial(){
    this.array = await this.servicio.GetDataInicial();
  }

  async cargaHistorico() {
    this.arrayHistorico = await this.servicio.getHistorico();

  }
  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Proveedor', poisionX: '' })
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
eliminarBoxFile(HTMLElementBoxWho: string, HTMLElementRefFileHow: ElementRef, ElementRefHow: ElementRef, FormGroupNameKey: string) {
  document.getElementById(HTMLElementBoxWho)?.classList.add('disabledBox')
  HTMLElementRefFileHow.nativeElement.value = "";
  ElementRefHow.nativeElement.value = "";
  this.formulario().patchValue({ [FormGroupNameKey]: '',['comprobanteCambio']:'' })
}
  resetForm() {
  this.eliminarBoxComprobante()
  // this.selectCuenta = true;
  // this.selectConcepto = true;
  this.formulario().patchValue({
    
    ['Id_Mov_Prov']:'',
    ['Id_ICPC']:'',
    ['Id_CuentaB']:'',
    ['Monto']:'',
    ['Concepto']:'',
    ['Observaciones']:'',
    ['Comprobante']:'',
    ['usuario']:'',
    ['estatus']:'',
    ['comprobanteCambio']:'',
    
  });
  // this.inputINV.nativeElement.value = '';
  // this.nombreInversionista = '';
  // this.radioBtn1.nativeElement.checked = true
  this.editar = true
}
  cargaFormulario(form: Array<any>) {

    // console.log(form[0][0])
    // form[0][0].Tipo_Movimiento === 'Ingreso' ? (this.radioBtn1.nativeElement.checked = true) : (this.radioBtn2.nativeElement.checked = true)
    
    form[0].map((item: any) => {
      this.formulario().patchValue({
        
        ['Id_Mov_Prov']:item.Id_Mov_Prov,
        ['Id_ICPC']:item.Id_ICPC,
        ['Id_CuentaB']:item.Id_CuentaB,
        ['Monto']:item.Monto,
        ['Concepto']:item.Id_Concepto,
        ['Observaciones']:item.Observaciones,
        ['Comprobante']:item.Comprobante,
        ['usuario']:item.usuario,
        ['estatus']:item.Estatus,
        // ['comprobanteCambio']:item.comprobanteCambio,
        
      })
    })
    
    // let num = form[0][0].Tipo_Movimiento === 'Ingreso' ? 1 : 2;
    // this.Monto.nativeElement.value = this.getCurrency(form[0][0].Monto)

    if(form[0][0].Comprobante){
      document.getElementById("boxNameComprobante")?.classList.remove('disabledBox')
      this.inputComprobante.nativeElement.value = form[0][0].Comprobante;
    }



  this.nombreInversionista = form[0][0].nombre

  }
  getCurrency(value: number) {
    return formatCurrency(value, 'en', '', '', '1.2-4')
    // return formatCurrency(value, 'en', '$', '', '1.2-4')
  }



  // ---------------------------------
  // ------- Procedimientos de pantalla 1------

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

async enviar() {
    if (this.formulario().valid) {

      if( this.formulario().get('usuario')?.value ==='' || this.formulario().get('usuario')?.value == null){
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({usuario:credenciales.Id})
      }

      let registro = await this.servicio.AgregarMovProveedor( this.formulario() )
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
      
      // console.log(this.formulario().value)

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


  // ---------------------------------
  // ------- Procedimientos de Historico------
   getCurrencyTable(value: number) {
      // return formatCurrency(value, 'en', '', '', '1.2-4')
      return formatCurrency(value, 'en', '$', '', '1.2-4')
  }
   formatoFechaLatina( fecha:string ){
    let d, m,  a , res
    d = fecha.slice(8, 10)
    m = fecha.slice(5, 7)
    a = fecha.slice(0, 4)
    res = d+'-'+m+'-'+a
    return res
  }
  async verDatosoMovInversion(id: number) {

     const datos = await this.servicio.cargaMovProveedorId( id )

    if(datos.status === 'error'){
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
      return
    }

     const dialogRef = this._dialog.open(VentanaVerInformacionMovProvedor, {
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

    const dialogRef = this._dialog.open(VentanaBusquedaMovProveedor, {
      disableClose: true,
      data: '',
      width: '450px',

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.cargaMovProveedorId(id)
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
  async eliminaroMovInversion(id: number) {

    const dialogRef = this._dialog.open(VentanaEliminaMovProveedor, {
      disableClose: true,
      data: '',
      width: '300px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.GetCredenciales()
          .then(credenciales => {

            this.servicio.eliminaProveedor(id, '0', credenciales.Id)
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
      this.listaBusqueda = [data]
      this.Busqueda.nativeElement.value = '';
      this.disabledBtn = true;
    }
  



  // ---------------------------------
}