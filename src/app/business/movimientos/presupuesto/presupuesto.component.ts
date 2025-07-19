import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Facturas } from '../../../core/services/movFacturas.service';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { formatCurrency } from '@angular/common';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { VentanaBusquedaMovPresupuesto } from './ventanaBusquedaMov';
import { VentanaEliminaMovPresupuesto } from './ventanaEliminar';
import { Presupuesto } from '../../../core/services/movPresupuesto.service';

let BusquedaText = '';
let BusquedaID: Array<any>[] = [];

@Component({
  selector: 'app-presupuesto',
  imports: [ReactiveFormsModule],
  templateUrl: './presupuesto.component.html',
  styleUrl: './presupuesto.component.css'
})
export class PresupuestoComponent implements OnInit {

    constructor(
    public puenteData: PuenteDataService,
    private servicio: Presupuesto,
  ) { }

  // -------Variables de referencia---
  @ViewChild('Monto') Monto!: ElementRef;
  @ViewChild('Abono') Abono!: ElementRef;
  @ViewChild('CPago') CPago!: ElementRef;
  @ViewChild('cancelar') cancelar!: ElementRef;
  @ViewChild('radioBtn1') radioBtn1!: ElementRef;
  @ViewChild('radioBtn2') radioBtn2!: ElementRef;
  @ViewChild('MontoPresupuesto') MontoPresupuesto!: ElementRef;
  @ViewChild('Observaciones') Observaciones!: ElementRef;


  // ---------------------------------
  // -------Variables de entorno------
  criterioBusqueda: string = '';
  disabledBtn: any = true;
  listaBusqueda: Array<any>[] = [];
  arrayHistorico: Array<any>[] = [];
  arrayPresupuesto: Array<any>[] = [];
  array: Array<any>[] = [];
  editar: boolean = true;
  Hoy: string = "";
  comision:string = '0%'
  switch: boolean = true;
  
  private readonly _modalMsg = inject(ModalMsgService);
  private readonly _dialog = inject(MatDialog);

  // ---------------------------------
  // -------Variables Formulario------
  mensual = signal<FormGroup>(
    new FormGroup({
      monto: new FormControl( '' ,[Validators.required] ),
      usuario: new FormControl( '' ),
    })
  )
  abono = signal<FormGroup>(
    new FormGroup({

      id_abono : new FormControl( '' ),
      id_cuentaB: new FormControl( '' ,[Validators.required]),
      monto : new FormControl( '' ,[Validators.required] ),
      usuario: new FormControl( '' ),
      
    })
  )
  ajustePresupuesto = signal<FormGroup>(
    new FormGroup({
      
      monto: new FormControl( '' ,[Validators.required] ),
      tipo: new FormControl( '' ,[Validators.required] ),
      observaciones: new FormControl( '' ,[Validators.required] ),
      usuario: new FormControl( '' ),

    })
  )

  // ---------------------------------
  
  // -----------------------Procedimientos de inicio---------------------
  ngOnInit(): void {
    // this.Monto.nativeElement.disabled = true
    this.cargaDataInicial();
    this.setDataLogin();
    this.cargaHistorico();
    this.cargaPresupuestoMensual();
    this.Hoy = this.fechaActual();
  }
  async cargaDataInicial(){

    this.array = await this.servicio.GetDataInicial(); 
    // console.log(this.array)
    if(this.array[0][0].Resultado == 'Exito'){
      this.Monto.nativeElement.disabled = true
      this.Monto.nativeElement.classList.add('btnDisabled')
      this.DesactivaAbonoAjustesPresupuesto( false );
      return
    }
    this.Monto.nativeElement.disabled = false
    this.Monto.nativeElement.classList.remove('btnDisabled')
    this.DesactivaAbonoAjustesPresupuesto( true );

  }

  async cargaHistorico() {
    this.arrayHistorico = await this.servicio.getHistorico();

  }
  async cargaPresupuestoMensual() {
    this.arrayPresupuesto = await this.servicio.getPresupuestoMensual();

  }
  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Presupuesto', poisionX: '' })
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
    console.log(this.mensual().value)
    console.log(this.abono().value)
    console.log(this.ajustePresupuesto().value)
  }


  // ---------------------------------
  // ------- Procedimientos Generales------

  DesactivaAbonoAjustesPresupuesto( accion:boolean ){

    if(accion){
      this.radioBtn1.nativeElement.disabled = true
      this.radioBtn2.nativeElement.disabled = true
      this.MontoPresupuesto.nativeElement.disabled = true
      this.Observaciones.nativeElement.disabled = true
      this.CPago.nativeElement.disabled = true
      this.Abono.nativeElement.disabled = true
      this.cancelar.nativeElement.disabled = true
      this.cancelar.nativeElement.classList.add('btnDisabled')
      this.CPago.nativeElement.classList.add('btnDisabled')
      this.Abono.nativeElement.classList.add('btnDisabled')
      this.MontoPresupuesto.nativeElement.classList.add('btnDisabled')
      this.Observaciones.nativeElement.classList.add('btnDisabled')
      return
    }
    
    this.radioBtn1.nativeElement.disabled = false
    this.radioBtn2.nativeElement.disabled = false
    this.MontoPresupuesto.nativeElement.disabled = false
    this.Observaciones.nativeElement.disabled = false
    this.CPago.nativeElement.disabled = false
    this.Abono.nativeElement.disabled = false
    this.cancelar.nativeElement.disabled = false
    this.cancelar.nativeElement.classList.remove('btnDisabled')
    this.CPago.nativeElement.classList.remove('btnDisabled')
    this.Abono.nativeElement.classList.remove('btnDisabled')
    this.MontoPresupuesto.nativeElement.classList.remove('btnDisabled')
    this.Observaciones.nativeElement.classList.remove('btnDisabled')

  }

resetForm() {
  // this.mensual().patchValue({
  //   ['Monto']:'',
  // });

  this.abono().patchValue({
    ['id_abono']:'',
    ['id_cuentaB']:'',
    ['monto']:'',
    ['usuario']:'',
  });

  // this.ajustePresupuesto().patchValue({
  //   ['Tipo_Movimiento']:'',
  //   ['Monto']:'',
  //   ['observaciones']:'',
  // });

  this.editar = true

    if(this.array[0][0].Resultado == 'Exito'){
      this.Monto.nativeElement.disabled = true
      this.Monto.nativeElement.classList.add('btnDisabled')
    }

  //  this.Monto.nativeElement.disabled = false
  //   this.Monto.nativeElement.classList.remove('btnDisabled')
    this.radioBtn1.nativeElement.disabled = false
    this.radioBtn2.nativeElement.disabled = false
    this.MontoPresupuesto.nativeElement.disabled = false
    this.MontoPresupuesto.nativeElement.classList.remove('btnDisabled')
    this.Observaciones.nativeElement.disabled = false
    this.Observaciones.nativeElement.classList.remove('btnDisabled')
  // this.switch = true
  // this.switchbtn.nativeElement.checked = false;
}

resetMensual() {
  this.mensual().patchValue({
    ['monto']:'',
  });
}

resetPresupuesto() {

  this.ajustePresupuesto().patchValue({
    ['monto']:'',
    ['tipo']:'',
    ['observaciones']:'',
  });

    this.radioBtn1.nativeElement.checked = ''
    this.radioBtn2.nativeElement.checked = ''
}

  cargaFormulario(form: Array<any>) {
    
    form[0].map((item: any) => {

      this.abono().patchValue({

        ['id_abono']:item.id_abono,
        ['id_cuentaB']:item.Id_CuentaB,
        ['monto']:item.abono,
        
      })
    })
    
    this.Abono.nativeElement.value = this.getCurrency(form[0][0].abono)

    this.Monto.nativeElement.disabled = true
    this.Monto.nativeElement.classList.add('btnDisabled')
    this.radioBtn1.nativeElement.disabled = true
    this.radioBtn2.nativeElement.disabled = true
    this.MontoPresupuesto.nativeElement.disabled = true
    this.MontoPresupuesto.nativeElement.classList.add('btnDisabled')
    this.Observaciones.nativeElement.disabled = true
    this.Observaciones.nativeElement.classList.add('btnDisabled')

    // console.log(form[0][0].Estatus_Pagado)
    // if(form[0][0].Estatus_Pagado == '1'){
    //   this.switch = false;
    // }else{
    //   this.switch = true;
    // }
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

  esquemaComision( event: any ){
    this.array[0].map( (item:any) => {
      if(item.Id_ICPC == event.target.selectedOptions[0].value){
        this.comision = item.comision + '%'
        return
      }
    } )
  }

  getCurrencyMonto(event: any) {
    let value = event.target.value
    let returnvalor = value
    if (value != '') {
      returnvalor = formatCurrency(+value, 'en', '', '', '1.2-4')
      this.mensual().patchValue({ ['monto']: returnvalor.replace(/[^0-9.]/g, "") })
      event.target.value = returnvalor
      return
    }
    this.mensual().patchValue({ ['monto']: '' })
    event.target.value = returnvalor
  }

  getCurrencyAbono(event: any) {
    let value = event.target.value
    let returnvalor = value
    if (value != '') {
      returnvalor = formatCurrency(+value, 'en', '', '', '1.2-4')
      this.abono().patchValue({ ['monto']: returnvalor.replace(/[^0-9.]/g, "") })
      event.target.value = returnvalor
      return
    }
    this.abono().patchValue({ ['monto']: '' })
    event.target.value = returnvalor
  }

  getCurrencyPresupuesto(event: any) {
    let value = event.target.value
    let returnvalor = value
    if (value != '') {
      returnvalor = formatCurrency(+value, 'en', '', '', '1.2-4')
      this.ajustePresupuesto().patchValue({ ['monto']: returnvalor.replace(/[^0-9.]/g, "") })
      event.target.value = returnvalor
      return
    }
    this.ajustePresupuesto().patchValue({ ['monto']: '' })
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


async enviarMensual() {

    if (this.mensual().valid) {

      if( this.mensual().get('usuario')?.value ===''){
        let credenciales = await this.servicio.GetCredenciales()
        this.mensual().patchValue({usuario:credenciales.Id})
      }

      let registro = await this.servicio.InsertaPresupuestoMensual( this.mensual() )
      if ( registro.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
        return
      }
      
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'exito' )
      this.resetMensual()
      this.cargaHistorico();
      this.cargaDataInicial();
      this.cargaPresupuestoMensual();
      // this.listaBusqueda = [];
    }

}

async AjustePresupuesto() {

    if (this.ajustePresupuesto().valid) {

      if( this.ajustePresupuesto().get('tipo')?.value == 'Disminucion' ){
        let comparacion = this.arrayPresupuesto[0][0].Monto - this.ajustePresupuesto().get('monto')?.value

        console.log(comparacion)
        if( comparacion <= 0 || this.ajustePresupuesto().get('monto')?.value == 0 ) {
          let data = { mensaje: `No es posible disminuir más el Presupuesto Mensual porque el saldo actual es “0.00” ó No estas ingresando montos diferentes a “0.00” ` };
          this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, false, '300px', 'error');
          return
        }
        if( this.ajustePresupuesto().get('usuario')?.value ===''){
        let credenciales = await this.servicio.GetCredenciales()
        this.ajustePresupuesto().patchValue({usuario:credenciales.Id})
      }

      let registro = await this.servicio.modificacionPresupuestoMensual( this.ajustePresupuesto() )
      if ( registro.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
        return
      }
      
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'exito' )
      this.resetPresupuesto()
      this.cargaHistorico();
      this.cargaPresupuestoMensual();

      }else if(this.ajustePresupuesto().get('tipo')?.value == 'Incremento'){

        if( this.ajustePresupuesto().get('monto')?.value == 0 ){
          let data = { mensaje: `Tienes que ingresar montos distintos a “0”` };
          this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, false, '300px', 'error');
          return
        }

        // console.log('incremente')
        if( this.ajustePresupuesto().get('usuario')?.value ===''){
          let credenciales = await this.servicio.GetCredenciales()
          this.ajustePresupuesto().patchValue({usuario:credenciales.Id})
        }
  
        let registro = await this.servicio.modificacionPresupuestoMensual( this.ajustePresupuesto() )
        if ( registro.status === 'error' ){
          this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
          return
        }
        
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'exito' )
        this.resetPresupuesto()
        this.cargaHistorico();
        this.cargaPresupuestoMensual();
      }


    }

}

async enviarAbono() {

    if (this.abono().valid) {

// console.log(this.arrayPresupuesto[0][0].Monto)
      if( this.abono().get('monto')?.value > this.arrayPresupuesto[0][0].Monto ) {
        let data = { mensaje: `El Abono no puede ser aplicado. Al aplicar este Abono estarías superando el monto del Presupuesto Mensual.` };
        this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, false, '300px', 'error');
        return
      }

      if( this.abono().get('usuario')?.value ===''){
        let credenciales = await this.servicio.GetCredenciales()
        this.abono().patchValue({usuario:credenciales.Id})
      }

      let registro = await this.servicio.abonoPresupuestoMensual( this.abono() )
      if ( registro.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
        return
      }
      
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'exito' )
      this.resetForm()
      this.cargaHistorico();
      this.cargaPresupuestoMensual();
      // this.listaBusqueda = [];
    }

}

async ActualizarAbono() {

    if ( this.abono().valid ){

      if( this.abono().get('monto')?.value > this.arrayPresupuesto[0][0].Monto ) {
        let data = { mensaje: `Modificacion del Abono excedido` };
        this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, false, '300px', 'error');
        return
      }

      if( this.abono().get('usuario')?.value == ''){
        let credenciales = await this.servicio.GetCredenciales()
        this.abono().patchValue({usuario:credenciales.Id})
      }

      let registroActualizado = await this.servicio.ActualizacioPresupuestoMensual(this.abono())

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
      this.cargaPresupuestoMensual();
      // this.listaBusqueda = [];

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

  editaroMov(id: number) {

    const dialogRef = this._dialog.open(VentanaBusquedaMovPresupuesto, {
      disableClose: true,
      data: '',
      width: '450px',

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.cargaMovPresupuestoId(id)
          .then(datos => {
            if (datos.status === 'error') {
              this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: datos.data }, false, '300px', 'exito')
              return
            }
            this.resetForm()
            this.editar = false
            // this.cargaHistorico();
            // BusquedaID = datos;
            this.cargaFormulario(datos)
          })
      }
    });

  }
  async eliminaroMov(id: number) {

    const dialogRef = this._dialog.open(VentanaEliminaMovPresupuesto, {
      disableClose: true,
      data: '',
      width: '300px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.GetCredenciales()
          .then(credenciales => {

            this.servicio.eliminaPresupuesto(id, '0', credenciales.Id)
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
    // inputBusqueda(event: any) {
    //   this.criterioBusqueda = event.target.value;
    //   // this.criterioBusqueda = ''; 
    //   if (event.target.value.length > 0) {
    //     this.disabledBtn = false;
    //     return
    //   }
    //   this.disabledBtn = true;
    // }
  
    // async busqueda() {
    //   BusquedaText = this.criterioBusqueda
  
    //   const data = await this.servicio.busqueda(this.criterioBusqueda)
  
    //   if (data.status === 'error') {
  
    //     this.listaBusqueda = []
  
    //     this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data.data }, false, '300px', 'exito')
    //     this.Busqueda.nativeElement.value = '';
    //     this.disabledBtn = true;
    //     return
    //   }
    //   this.listaBusqueda = data
    //   this.Busqueda.nativeElement.value = '';
    //   this.disabledBtn = true;
    // }
  



  // ---------------------------------

}
