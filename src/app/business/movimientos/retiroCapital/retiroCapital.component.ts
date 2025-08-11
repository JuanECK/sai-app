import { Component, ElementRef, EventEmitter, inject, OnInit, output, Output, signal, ViewChild } from '@angular/core';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { formatCurrency } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VentanaVerInformacionMovInversion } from './ventanaVerInformacionMovretiroCapital';
import { VentanaBusquedaMovInversion } from './ventanaBusquedaMovretiroCapital';
import { VentanaEliminaMovInversion } from './ventanaEliminar';
import { RetiroCapital } from '../../../core/services/movRetiroCapital.service';

let BusquedaText = '';
let BusquedaID: Array<any>[] = [];

@Component({
  selector: 'app-brk',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './retiroCapital.component.html',
  styleUrl: './retiroCapital.component.css'
})
export class RetiroCapitalComponent implements OnInit {

  constructor(
    public puenteData: PuenteDataService,
    private servicio: RetiroCapital
  ) { }

  @ViewChild('Busqueda') Busqueda!: ElementRef;
  // @ViewChild('nombreInv') nombreInv!: ElementRef;
  // @ViewChild('FileComprobante') FileComprobante!: ElementRef;
  // @ViewChild('inputComprobante') inputComprobante!: ElementRef;
  // @ViewChild('inputINV') inputINV!: ElementRef;
  @ViewChild('Concepto') Concepto!: ElementRef;
  // @ViewChild('radioBtn1') radioBtn1!: ElementRef;
  // @ViewChild('radioBtn2') radioBtn2!: ElementRef;
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
  selectConcepto: boolean = true;
  selectCuenta: boolean = true;
  cantidad: string = '$ 0.00';
  reconocido: boolean = false;

  private readonly _modalMsg = inject(ModalMsgService);
  private readonly _dialog = inject(MatDialog);

  formulario = signal<FormGroup>(
    new FormGroup({

     Id_CuentaB: new FormControl('', [Validators.required]),
     monto: new FormControl('', [Validators.required]), 
     justificacion: new FormControl('', [Validators.required]),
     Id_RetiroCapital: new FormControl(''),
     usuario: new FormControl(''),

    })
  )

  ngOnInit(): void {
    this.setDataLogin();
    this.cargaHistorico();
    this.cargaDataInicial();
    this.Hoy = this.fechaActual();
  }

  async cargaDataInicial() {
    this.array = await this.servicio.GetDataInicial();
  }

  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Retiro de Capital', poisionX: '' })
  }

  ver() {
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

  formatoFechaLatina(fecha: string) {
    let d, m, a, res
    d = fecha.slice(8, 10)
    m = fecha.slice(5, 7)
    a = fecha.slice(0, 4)
    res = d + '-' + m + '-' + a
    return res
  }


  evaluaCheck(num: number) {
    this.formulario().patchValue({ ['Concepto']: '' })
    this.Concepto.nativeElement.value = '';
    this.selectConcepto = true;
    if (num === 1) {
      this.formulario().patchValue({ 'Tipo_Movimiento': 'Ingreso' })
      this.check = true
      return
    }
    if (num === 2) {
      this.formulario().patchValue({ 'Tipo_Movimiento': 'Egreso' })
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

  soloDigito(event: any) {
    let valorMonto = event.target.value;
    valorMonto = valorMonto
      .replace(/\D/g, "")
    event.target.value = valorMonto
  }

  async optionCuenta(event: any) {
    if (event.target.selectedOptions[0].text.length > 16) {
      this.selectCuenta = false
    } else {
      this.selectCuenta = true
    }
    // setTimeout(() => {
    //   this.mySelect.nativeElement.value = '';
    // }, 100)
  }

  optionConcepto(event: any) {

    // this.cantidad = '$ ', event.target.selectedOptions[0].id
    this.cantidad = formatCurrency(+event.target.selectedOptions[0].id, 'en', '$', '', '1.2-4')
    console.log(event.target.selectedOptions[0].id)
    // if (event.target.selectedOptions[0].text.length > 16) {
    //   this.selectConcepto = false
    // } else {
    //   this.selectConcepto = true
    // }

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

  // async busquedaInversionista( event:any ){
  //   console.log(this.inputINV.nativeElement.value)
  //   if( this.inputINV.nativeElement.value == "" ){
  //     return
  //   }
  //   let lista = await this.servicio.busquedaInversionista( 'INV-'+this.inputINV.nativeElement.value )

  //   if( lista[0].Resultado == "Sindatos" ){
  //     this.cantidad = 'Sin coincidencias'
  //     this.nombreInv.nativeElement.classList.add('nombreSinCoincidencias')
  //     return
  //   }
  //   this.nombreInv.nativeElement.classList.remove('nombreSinCoincidencias')
  //   this.cantidad = lista[0].Nombre_Razon_Social
  //   this.formulario().patchValue({['Id_ICPC']:lista[0].Id_ICPC})
  //   console.log(lista)

  // }

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

  async enviar() {
    if (this.formulario().valid) {

      if (this.formulario().get('usuario')?.value === '' || this.formulario().get('usuario')?.value == null) {
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({ usuario: credenciales.Id })
      }

      let registro = await this.servicio.AgregarMovRetiroCapital(this.formulario())
      if (registro.status === 'error') {
        this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: registro.data }, false, '300px', 'error')
        return
      }

      this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: registro.data }, false, '300px', 'exito')
      this.resetForm()
      this.cargaDataInicial()
      this.cargaHistorico();
      this.listaBusqueda = [];
    }

  }

  async ActualizarRegistro() {

    if (this.formulario().valid) {

      // console.log(this.formulario().value)

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
  }

  getCurrencyTable(value: number) {
    return formatCurrency(value, 'en', '$', '', '1.2-4')
  }

  async verDatosoMovRetiroCapital(id: number) {

     const datos = await this.servicio.cargaMovRetiroCapitalId( id )
     console.log(datos)

    if(datos.status === 'error'){
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
      return
    }

     const dialogRef = this._dialog.open(VentanaVerInformacionMovInversion, {
       disableClose: true,
       data: [datos],
       width: '705px',
       maxWidth: '100%',
     })

     dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.cargaHistorico();
      }
     })

  }

  editaroMovRetiroCapital(id: number) {

    const dialogRef = this._dialog.open(VentanaBusquedaMovInversion, {
      disableClose: true,
      data: '',
      width: '450px',

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.cargaMovRetiroCapitalId(id)
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

    console.log(form[0])
    // form[0][0].Tipo_Movimiento === 'Ingreso' ? (this.radioBtn1.nativeElement.checked = true) : (this.radioBtn2.nativeElement.checked = true)

    form.map((item: any) => {
      this.formulario().patchValue({

        ['Id_CuentaB']: item.Id_CuentaBancaria,
        ['monto']: item.Monto,
        ['Id_RetiroCapital']: item.Id_RetiroCapital,
        ['justificacion']: item.Justificacion,
        
        // ['usuario']: item.usuario,

      })
    })

    // let num = form[0][0].Tipo_Movimiento === 'Ingreso' ? 1 : 2;
    this.Monto.nativeElement.value = this.getCurrency(form[0].Monto)
    this.cantidad = formatCurrency(+form[0].Saldo, 'en', '$', '', '1.2-4')

    // if (form[0][0].Comprobante) {
    //   document.getElementById("boxNameComprobante")?.classList.remove('disabledBox')
    //   this.inputComprobante.nativeElement.value = form[0][0].Comprobante;
    // }

    // if (num === 1) {
    //   this.check = true
    //   // return
    // }
    // if (num === 2) {
    //   this.check = false
    //   // return
    // }

    // this.cantidad = form[0][0].nombre

    // if (form[0][0].reconocido == 1) {
    //   this.Monto.nativeElement.disabled = true
    //   this.reconocido = true;
    //   this.radioBtn2.nativeElement.disabled = true
    // }

  }

  async eliminaroMovRetiroCapital(id: number) {

    const dialogRef = this._dialog.open(VentanaEliminaMovInversion, {
      disableClose: true,
      data: '',
      width: '300px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.GetCredenciales()
          .then(credenciales => {

            this.servicio.elimina(id, '0', credenciales.Id)
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

  resetForm() {
    this.selectCuenta = true;
    this.selectConcepto = true;
    this.formulario().patchValue({

      ['Id_CuentaB']: '',
      ['monto']: '',
      ['justificacion']: '',
      ['usuario']: '',

    });
    this.Monto.nativeElement.disabled = false
    // this.inputINV.nativeElement.value = '';
    this.cantidad = '$ 0.00';
    // this.radioBtn1.nativeElement.checked = true
    // this.radioBtn2.nativeElement.disabled = false
    this.reconocido = false
    this.editar = true
  }

}
