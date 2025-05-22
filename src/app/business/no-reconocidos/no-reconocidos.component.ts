import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { PuenteDataService } from '../../core/services/puente-data.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { noReconocidos } from '../../core/services/noReconocidos.service';
import { ModalMsgService } from '../../core/services/modal-msg.service';
import { ModalMsgComponent } from '../../core/modal-msg/modal-msg.component';
import { VentanaAsignacionNoReconosidos } from './ventanaAsignacionNoReconosidos';
import { MatDialog } from '@angular/material/dialog';
import { VentanaBusquedaNoReconocidos } from './ventanaBusquedaCuentas';
import { VentanaEliminaNoReconocidos } from './ventanaEliminarCuentas';
import { VentanaEstatusPrestamoNoReconosidos } from './ventanaEstatusPrestamoNoReconosidos';

let BusquedaID: Array<any>[] = [];

@Component({
  selector: 'app-no-reconocidos',
  standalone:true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './no-reconocidos.component.html',
  styleUrl: './no-reconocidos.component.css'
})
export class NoReconocidosComponent implements OnInit {

    constructor(
      public servicio: noReconocidos,
      public puenteData:PuenteDataService
    ){}

    @ViewChild('radioBtn1') radioBtn1!:ElementRef;
    @ViewChild('radioBtn2') radioBtn2!:ElementRef;
    @ViewChild('Monto') Monto!:ElementRef;

  formulario = signal<FormGroup>(
    new FormGroup({

      Tipo_Movimiento: new FormControl( 'Ingreso' ),  
      Id_CuentaB: new FormControl('',[Validators.required] ),  
      Monto: new FormControl( '',[Validators.required] ),  
      Fecha_Ingreso: new FormControl( '',[Validators.required] ),  
      Observaciones: new FormControl( '' ), 
      usuario: new FormControl( '' ),
      Id_Mov_RN: new FormControl( '' ), 
      estatus: new FormControl( 1 ), 

    })
  )

  editar: boolean = true;
  Hoy: string = "";
  selectCuenta: boolean = true;
  arrayCuentaIngreso: Array<any>[] = [];
  arrayHistorico: Array<any>[] = [];

   private readonly _dialog = inject(MatDialog);
  private readonly _modalMsg = inject(ModalMsgService);

  ngOnInit(): void {
    this.setDataLogin();
    this.Hoy = this.fechaActual();
    this.cargaCuentasLista();
    this.cargaHistorico();
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
    this.puenteData.disparadorData.emit({dato:'No Reconocidos', poisionX: '' })
  }

  async cargaHistorico(){
    this.arrayHistorico = await this.servicio.getHistorico();
  }
  async cargaCuentasLista(){
    this.arrayCuentaIngreso = await this.servicio.getCuentas();
  }

   getCurrency(value: number) {
    return formatCurrency(value, 'en', '', '', '1.2-4')
    // return formatCurrency(value, 'en', '$', '','1.2-4')
  }
   getCurrencyTable(value: number) {
    // return formatCurrency(value, 'en', '', '', '1.2-4')
    return formatCurrency(value, 'en', '$', '','1.2-4')
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
  
      console.log(this.formulario().value)
  
      if (this.formulario().valid) {
  
        if (this.formulario().get('usuario')?.value === '' || this.formulario().get('usuario')?.value == null) {
          let credenciales = await this.servicio.GetCredenciales()
          this.formulario().patchValue({ usuario: credenciales.Id })
        }
  
        let registro = await this.servicio.AgregarCuenta(this.formulario().value)
        if (registro.status === 'error') {
          this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: registro.data }, false, '300px', 'error')
          return
        }
  
        this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: registro.data }, false, '300px', 'exito')
        this.resetForm()
        this.cargaHistorico()
  
      }
  
    }

    async ActualizarRegistro() {
  
      if (this.formulario().valid) {
  
        if (this.formulario().get('usuario')?.value == '') {
          let credenciales = await this.servicio.GetCredenciales()
          this.formulario().patchValue({ usuario: credenciales.Id })
        }
  
        let registroActualizado = await this.servicio.EnviarActualizacio(this.formulario(), BusquedaID)
  
        if (registroActualizado.status === 'error') {
          this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: registroActualizado.data }, false, '300px', 'error')
          return
        }
  
        if (registroActualizado.status === 'edicion') {
          this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: registroActualizado.data }, false, '300px', 'exito')
          return
        }
  
        this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: registroActualizado.data }, false, '300px', 'exito')
        this.resetForm()
        this.cargaHistorico();
  
      }
  
  
    }

  resetForm() {

    this.formulario().reset({
      "Tipo_Movimiento": 'Ingreso',
      "Id_CuentaB": '',
      "Monto": '',
      "Fecha_Ingreso": '',
      "Observaciones": '',
      "usuario": '',
      "Id_Mov_RN": '',
      "estatus": 1 ,
    });

    this.editar = true
    // this.arrayCuentaIngreso = [];
     this.radioBtn1.nativeElement.checked = 1
     this.Monto.nativeElement.value = ''

  }

  verDatosobservaciones(id:number){

     const dialogRef = this._dialog.open(VentanaAsignacionNoReconosidos, {
       disableClose: true,
       data: id,
       width: '705px',
       maxWidth: '100%',
     })
 
     dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.cargaHistorico();
      }
     })

  }

  editarobservaciones(id: number) {

    const dialogRef = this._dialog.open(VentanaBusquedaNoReconocidos, {
      disableClose: true,
      data: '',
      width: '300px',

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.cargaObservacionesId(id)
          .then(datos => {
            if (datos.status === 'error') {
              this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: datos.data }, false, '300px', 'exito')
              return
            }
            this.resetForm()
            this.editar = false
            BusquedaID = datos;
            this.cargaFormulario(datos)
          })
      }
    });

  }

    cargaFormulario(formNoReconosidos: Array<any>) {

    console.log(formNoReconosidos)

    // formNoReconosidos[0].clabe = this.formatDigitoBancarios(null, 3, formNoReconosidos[0].clabe)
    // formNoReconosidos[0].noCuenta = this.formatDigitoBancarios(null, 4, formNoReconosidos[0].noCuenta)
    // formNoReconosidos[0].tarjeta = this.formatDigitoBancarios(null, 4, formNoReconosidos[0].tarjeta)

    formNoReconosidos.map((item: any) => {
      this.formulario().patchValue({

        ['Tipo_Movimiento']:item.Tipo_Movimiento,
        ['Id_CuentaB']:item.Id_CuentaB,
        ['Monto']:item.Monto,
        ['Fecha_Ingreso']:item.Fecha_Ingreso,
        ['Observaciones']:item.Observaciones,
        // ['usuario']:item.usuario,
        ['Id_Mov_RN']:item.Id_Mov_RN,
        // ['estatus']:item.estatus,

      })
    })

    // this.ClaveInput.nativeElement.value = formNoReconosidos[0].clabe
    // this.noCuentaInput.nativeElement.value = formNoReconosidos[0].noCuenta
    // this.TargetaInput.nativeElement.value = formNoReconosidos[0].tarjeta
    formNoReconosidos[0].Tipo_Movimiento === 'Ingreso' ? (this.radioBtn1.nativeElement.checked = true) : (this.radioBtn2.nativeElement.checked = true)
    this.Monto.nativeElement.value = this.getCurrency(formNoReconosidos[0].Monto)

  }

  async eliminarobservaciones(id: number) {

    const dialogRef = this._dialog.open(VentanaEliminaNoReconocidos, {
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

                // this.servicio.busqueda(this.criterioBusqueda)
                //   .then(data => {

                //     this.listaBusqueda = data

                //   })

              })

          })

      }
    })

  }

  cambiarEstadoPrestamo(id: number){

     const dialogRef = this._dialog.open(VentanaEstatusPrestamoNoReconosidos, {
       disableClose: true,
       data: id,
       width: '400px',
       maxWidth: '100%',
     })
 
     dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.cargaHistorico();
      }
     })

  }

  ver(){
    console.log(this.formulario().value)
  }

}
