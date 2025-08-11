import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Facturas } from '../../../core/services/movFacturas.service';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { formatCurrency } from '@angular/common';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { VentanaFinalizarMovimiento } from './ventanaVerInformacionMov';
import { VentanaBusquedaMovFacturas } from './ventanaBusquedaMov';
import { VentanaEliminaMovFacturas } from './ventanaEliminar';

let BusquedaText = '';
let BusquedaID: Array<any>[] = [];

@Component({
  selector: 'app-facturas',
  imports: [ReactiveFormsModule],
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.css'
})
export class FacturasComponent implements OnInit {

    constructor(
    public puenteData: PuenteDataService,
    private servicio: Facturas,
  ) { }

  // -------Variables de referencia---
  @ViewChild('Busqueda') Busqueda!: ElementRef;
  @ViewChild('Monto') Monto!: ElementRef;
  @ViewChild('TabsInformacion') TabsInformacion!: ElementRef;
  @ViewChild('switchbtn') switchbtn!: ElementRef;


  // ---------------------------------
  // -------Variables de entorno------
  criterioBusqueda: string = '';
  disabledBtn: any = true;
  listaBusqueda: Array<any>[] = [];
  arrayHistorico: Array<any>[] = [];
  array: Array<any>[] = [];
  editar: boolean = true;
  Hoy: string = "";
  comision:string = '0%'
  switch: boolean = true;
  
  private readonly _modalMsg = inject(ModalMsgService);
  private readonly _dialog = inject(MatDialog);

  // ---------------------------------
  // -------Variables Formulario------
  formulario = signal<FormGroup>(
    new FormGroup({

      Id_Mov_Fact: new FormControl( '' ),
      Id_Esquema: new FormControl( '' ,[Validators.required] ),
      Monto: new FormControl( '' ,[Validators.required] ),
      usuario: new FormControl( '' ),
      estatus: new FormControl( '' ),

      Estatus_Pagado: new FormControl( '' ),
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
    this.puenteData.disparadorData.emit({ dato: 'Facturación', poisionX: '' })
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

resetForm() {
  this.formulario().patchValue({

    ['Id_Mov_Fact']:'',
    ['Id_Esquema']:'',
    ['Monto']:'',
    ['usuario']:'',
    ['estatus']:'',
    ['Estatus_Pagado']:'',

  });
  this.comision = 0 +'%'
  this.editar = true
  this.switch = true
  this.switchbtn.nativeElement.checked = false;
}

cargaFormulario(form: Array<any>) {
    
    form[0].map((item: any) => {
      this.formulario().patchValue({

        ['Id_Mov_Fact']:item.Id_Mov_Fact,
        ['Id_Esquema']:item.Id_Esquema,
        ['Monto']:item.Monto,
        ['Estatus_Pagado']:item.Estatus_Pagado,
        
      })
    })
    this.comision = form[0][0].Comision_propia + '%'
    this.Monto.nativeElement.value = this.getCurrency(form[0][0].Monto)
    console.log(form[0][0].Estatus_Pagado)
    if(form[0][0].Estatus_Pagado == '1'){
      this.switch = false;
    }else{
      this.switch = true;
    }
  }
  getCurrency(value: number) {
    return formatCurrency(value, 'en', '', '', '1.2-4')
    // return formatCurrency(value, 'en', '$', '', '1.2-4')
  }



  // ---------------------------------
  // ------- Procedimientos de pantalla 1------

  evaluaEstatusPagado( event:any ){
    if(event.target.checked){
      this.formulario().patchValue({['Estatus_Pagado']:'0'})
      return
    }
    this.formulario().patchValue({['Estatus_Pagado']:'1'})
  }

  esquemaComision( event: any ){
    this.array[0].map( (item:any) => {
      if(item.Id_Esquema == event.target.selectedOptions[0].value){
        this.comision = item.comision + '%'
        return
      }
    } )
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

      let registro = await this.servicio.AgregarMovFacturas( this.formulario() )
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
  async verCambiaEstatusPagadoId(id: number) {

     const datos = await this.servicio.cargaEstatusPagadoId( id )

    if(datos.status === 'error'){
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
      return
    }

     const dialogRef = this._dialog.open(VentanaFinalizarMovimiento, {
       disableClose: true,
       data: {datos:datos, facturacion:this.array[1]},
       width: '705px',
       maxWidth: '100%',
     })

     dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.cargaHistorico();
        this.listaBusqueda = [];
        this.TabsInformacion.nativeElement.checked = true;

      }
     })

  }

  editaroMov(id: number) {

    const dialogRef = this._dialog.open(VentanaBusquedaMovFacturas, {
      disableClose: true,
      data: '',
      width: '450px',

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.cargaMovFacturasId(id)
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

    const dialogRef = this._dialog.open(VentanaEliminaMovFacturas, {
      disableClose: true,
      data: '',
      width: '300px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.GetCredenciales()
          .then(credenciales => {

            this.servicio.eliminaFacturas(id, '0', credenciales.Id)
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
      this.listaBusqueda = data
      this.Busqueda.nativeElement.value = '';
      this.disabledBtn = true;
    }
  



  // ---------------------------------

}
