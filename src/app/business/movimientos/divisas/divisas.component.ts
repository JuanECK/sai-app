import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Divisas } from '../../../core/services/movDivisas.service';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { VentanaVerInformacionMovDivisas } from './ventanaVerInformacionMov';
import { VentanaBusquedaMovDivisas } from './ventanaBusquedaMov';
import { VentanaEliminaMovDivisas } from './ventanaEliminar';

let BusquedaText = '';
let BusquedaID: Array<any>[] = [];

@Component({
  selector: 'app-divisas',
  imports: [ReactiveFormsModule],
  templateUrl: './divisas.component.html',
  styleUrl: './divisas.component.css'
})
export class DivisasComponent implements OnInit {

  constructor(
    public puenteData: PuenteDataService,
    private servicio: Divisas,
  ) { }

  // -------Variables de referencia---
  @ViewChild('Busqueda') Busqueda!: ElementRef;
  @ViewChild('Concepto') Concepto!: ElementRef;
  @ViewChild('Comision') Comision!: ElementRef;
  @ViewChild('FileComprobante') FileComprobante!: ElementRef;
  @ViewChild('inputComprobante') inputComprobante!: ElementRef;
  @ViewChild('inputINV') inputINV!: ElementRef;
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
  arrayConcepto: Array<any>[] = [];
  arrayCuenta: Array<any>[] = [];
  saldoResp: Array<any>[] = [];
  editar: boolean = true;
  Hoy: string = "";
  input_BRK: boolean = false;
  yued:boolean = false;
  saldo:string ='';
  Moneda:string ='';

  formu:Array<any>[] = []
  // selectDivisas: boolean = true;
  // selectConcepto: boolean = true;
  // selectCuenta: boolean = true;
  nombreInversionista: string = '';
  
  private readonly _modalMsg = inject(ModalMsgService);
  private readonly _dialog = inject(MatDialog);

  // ---------------------------------
  // -------Variables Formulario------
  formulario = signal<FormGroup>(

    new FormGroup({

      Id_Mov_Div: new FormControl(''),
      Id_ICPC: new FormControl('',[Validators.required]),
      Concepto: new FormControl('',[Validators.required]),
      Id_CuentaB: new FormControl('',[Validators.required]),
      Comision: new FormControl('',[Validators.required]),
      Observaciones: new FormControl(''),
      usuario: new FormControl(''),
      estatus: new FormControl(''),
       
    })
  )
  formularioYued = signal<FormGroup>(

    new FormGroup({

      Tipo_Movimiento: new FormControl('Ingreso'),
      Monto: new FormControl('',[Validators.required]),
      Tipo_Cuenta: new FormControl('',[Validators.required]),
       
    })
  )



  // ---------------------------------
  
  // -------Procedimientos de inicio------
  ngOnInit(): void {
    this.setDataLogin();
    this.cargaDataInicial();
    this.cargaHistorico();
    this.Hoy = this.fechaActual();
  }
    async cargaDataInicial(){
    this.array = await this.servicio.GetDataInicial();
  }

  async cargaHistorico() {
    this.arrayHistorico = await this.servicio.getHistorico();

  }
  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Divisas', poisionX: '' })
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
    
    // this.formu.push(this.formulario().value, this.formularioYued().value)
    // const newForm = new FormGroup({
    //   form1:this.formulario().value,
    //   form2:this.formularioYued().value
    // })
    // this.formulario().registerControl('new',this.formularioYued())
    // console.log(this.formu)
    console.log(this.formulario().value)
    console.log(this.formularioYued().value)
  }



  // ---------------------------------
  // ------- Procedimientos Generales------


  resetForm() {
  // this.selectCuenta = true;
  // this.selectConcepto = true;
  this.formu = []
  this.formulario().patchValue({

    ['Id_Mov_Div']:'',
    ['Id_ICPC']:'',
    ['Concepto']:'',
    ['Id_CuentaB']:'',
    ['Comision']:'',
    ['Observaciones']:'',
    ['estatus']:'',
        
  });

  this.formularioYued().patchValue({

    ['Tipo_Movimiento']:'Ingreso',
    ['Monto']:'',
    ['Tipo_Cuenta']:'',

  });
  // this.inputINV.nativeElement.value = '';
  // this.nombreInversionista = '';
  this.radioBtn1.nativeElement.checked = true
  this.editar = true
}

cargaFormularioSeleccionado( form: Array<any> ){
  let valor =  form[0][0].Id_ICPC
  // console.log(valor)

   for( let i = 0; i < this.array[5].length; i++ ){
      if( this.array[5][0].Id_ICPC == valor){
         this.arrayCuenta.push(this.array[6]) 
         this.yued = true
        //  console.log(this.array[5][i].Id_ICPC,' - 6 - ',form[0][0].Id_ICPC)
         return true
        } else if( this.array[5][1].Id_ICPC == valor ){
          // console.log(this.array[5][i].Id_ICPC,' - 7 -',form[0][0].Id_ICPC)
          this.yued = true
          this.arrayCuenta.push(this.array[7]) 
          return true
        }
        
      }
      // console.log(2)
      this.yued = false
    this.arrayCuenta.push(this.array[3]) 
    return false
    
}

  async cargaFormulario(form: Array<any>, valor:any) {

    // console.log(valor)
    this.arrayConcepto = []
    this.arrayCuenta = []
    let cargaSaldo = this.cargaFormularioSeleccionado( form )
    if(cargaSaldo){
      this.saldoResp = await this.servicio.GetSaldoYued(form[0][0].Id_ICPC)
      this.saldo = formatCurrency(this.saldoResp[0][0].Saldo, 'en', '$', '', '1.2-4')
    }
    if(this.yued){
      this.arrayConcepto.push(this.array[2]) 
      console.log(2)
    }else{
      this.yued = false
      console.log(1)
      this.arrayConcepto.push(this.array[1])
    }

    form[0][0].Tipo_Movimiento === 'Ingreso' ? (this.radioBtn1.nativeElement.checked = true) : (this.radioBtn2.nativeElement.checked = true)
    
    form[0].map((item: any) => {
      this.formulario().patchValue({

        ['Id_Mov_Div']:item.Id_Mov_Div,
        ['Id_ICPC']:item.Id_ICPC,
        ['Concepto']:item.Concepto,
        ['Id_CuentaB']:item.Id_CuentaB,
        ['Comision']:item.Comision,
        ['Observaciones']:item.Observaciones,
        ['estatus']:item.estatus,
        
      })
    })
    form[0].map((item: any) => {
      this.formularioYued().patchValue({

        ['Tipo_Movimiento']:item.Tipo_Movimiento,
        ['Monto']:item.Monto,
        ['Tipo_Cuenta']:item.Tipo_Cuenta,

      })
    })

    
    // let num = form[0][0].Tipo_Movimiento === 'Ingreso' ? 1 : 2;
    this.Monto.nativeElement.value = this.getCurrency(form[0][0].Monto)
    this.Comision.nativeElement.value = this.getCurrency(form[0][0].Comision)


    this.nombreInversionista = form[0][0].nombre

  }

  getCurrency(value: number) {
    return formatCurrency(value, 'en', '', '', '1.2-4')
    // return formatCurrency(value, 'en', '$', '', '1.2-4')
  }



  // ---------------------------------
  // ------- Procedimientos de pantalla 1------

  async evaluaCliente( event:any ){
    let valor = event.target.selectedOptions[0].value
    this.resetParcial();
    this.arrayConcepto = []
    this.arrayCuenta = []
    let respuesta = this.eva(valor)
    this.yued = respuesta.tipo

      if(this.yued){
        this.array[5].map(item =>{
          if(item.Id_ICPC == valor){
            this.arrayCuenta.push(this.array[6]) 
          }else{
            this.arrayCuenta.push(this.array[7]) 
          }
        })
      this.arrayConcepto.push(this.array[2]) 
      this.saldoResp = await this.servicio.GetSaldoYued(respuesta.idcp)
      this.saldo = formatCurrency(this.saldoResp[0][0].Saldo, 'en', '$', '', '1.2-4')
      this.Moneda =  this.saldoResp[0][0].Moneda
      // this.formulario().patchValue({['Id_ICPC']:valor})
      
      return
    }
    
    this.arrayCuenta.push(this.array[3]) 
    this.arrayConcepto.push(this.array[1])
    this.formulario().patchValue({['Id_ICPC']:valor})


  }

  eva( v:any ){

  for( let i = 0; i < this.array[5].length; i++ ){
      if( this.array[5][i].Id_ICPC == v ){
        return {tipo:true, idcp:this.array[5][i].Id_ICPC}
      } 
    }
    return {tipo:false, idcp:''}
  }

  resetParcial(){
    this.formu = []
    this.radioBtn1.nativeElement.checked = true
    // this.Concepto.nativeElement.value = ''
    this.formulario().patchValue({

      // ['Id_ICPC']:'',
      ['Concepto']:'',
      ['Id_CuentaB']:'',
      ['Comision']:'',
      ['Observaciones']:'',

    });
    this.formularioYued().patchValue({

      ['Tipo_Movimiento']:'Ingreso',
      ['Monto']:'',
      ['Tipo_Cuenta']:'',

    });

  }


  evaluaIngreso(){
    this.formularioYued().patchValue({'Tipo_Movimiento':'Ingreso'})
    this.formularioYued().patchValue({['Monto']:''})
    
  }
  evaluaEgreso(){
    this.formularioYued().patchValue({'Tipo_Movimiento':'Egreso'})
    this.formularioYued().patchValue({['Monto']:''})
  }

  evaluaSaldoEgresoYued(value:string){
     if( this.formularioYued().get('Tipo_Movimiento')?.value == 'Egreso' && value > this.saldoResp[0][0].Saldo){
      return true
    }
     return false
  }

  getCurrencySaldoYued(event: any) {
    let value = event.target.value
    let returnvalor = value
    if( this.evaluaSaldoEgresoYued(value) ){
      event.target.value = ''
      let data = { mensaje: `El egreso solicitado excede el saldo actual` };
      this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, false, '300px', 'error');
      return
    }
    if (value != '') {
      returnvalor = formatCurrency(+value, 'en', '', '', '1.2-4')
      this.formularioYued().patchValue({ ['Monto']: returnvalor.replace(/[^0-9.]/g, "") })
      event.target.value = returnvalor
      return
    }
    this.formulario().patchValue({ ['Monto']: 0 })
    event.target.value = returnvalor
  }

  getCurrencySaldo(event: any) {
    let value = event.target.value
    let returnvalor = value
    if (value != '') {
      returnvalor = formatCurrency(+value, 'en', '', '', '1.2-4')
      this.formulario().patchValue({ ['Comision']: returnvalor.replace(/[^0-9.]/g, "") })
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

async enviar() {
    if (this.formulario().valid) {

      if( this.formulario().get('usuario')?.value ==='' ){
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({usuario:credenciales.Id})
      }

    this.formu.push(this.formulario().value, this.formularioYued().value)

      let registro = await this.servicio.AgregarMovDivisas( this.formu )
      if ( registro.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
        return
      }
      
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'exito' )
      this.resetForm()
      this.cargaHistorico();
      this.listaBusqueda = [];
      this.formulario().patchValue({['Id_ICPC']:''})
      this.yued = false
    }

}

async ActualizarRegistro() {

    if ( this.formulario().valid ){

      if( this.formulario().get('usuario')?.value == ''){
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({usuario:credenciales.Id})
      }

      // this.formu.push(this.formulario().value, this.formularioYued().value)
      const objeto = Object.assign(this.formulario().value, this.formularioYued().value)
      let registroActualizado = await this.servicio.EnviarActualizacio(objeto, BusquedaID)

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
  async verDatosoId(id: number) {

     const datos = await this.servicio.cargaMovDivisasId( id )

    if(datos.status === 'error'){
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
      return
    }

     const dialogRef = this._dialog.open(VentanaVerInformacionMovDivisas, {
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

  editaroMov(id: number) {

    const dialogRef = this._dialog.open(VentanaBusquedaMovDivisas, {
      disableClose: true,
      data: '',
      width: '450px',

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.cargaMovDivisasId(id)
          .then(datos => {
            if (datos.status === 'error') {
              this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: datos.data }, false, '300px', 'exito')
              return
            }
            this.resetForm()
            this.editar = false
            // this.cargaHistorico();
            BusquedaID = datos;
            this.cargaFormulario(datos, id)
          })
      }
    });

  }
  async eliminaroMov(id: number) {

    const dialogRef = this._dialog.open(VentanaEliminaMovDivisas, {
      disableClose: true,
      data: '',
      width: '300px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.GetCredenciales()
          .then(credenciales => {

            this.servicio.eliminaDivisas(id, '0', credenciales.Id)
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
