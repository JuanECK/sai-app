import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PuenteDataService } from '../../core/services/puente-data.service';
import { ModalMsgService } from '../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalMsgComponent } from '../../core/modal-msg/modal-msg.component';
import { VentanaVerInformacionCuentas } from './ventanaVerInformacionCuentas';
import { VentanaBusquedaCuentas } from './ventanaBusquedaCuentas';
import { VentanaEliminaCuentas } from './ventanaEliminarCuentas';
import { formatCurrency } from '@angular/common';
import { Cuentas } from '../../core/services/cuentas.service';
import { stringify } from 'querystring';

let BusquedaText = '';
let BusquedaID: Array<any>[] = [];

/**
 * Componente principal para la gestión de cuentas bancarias.
 * Permite registrar, editar, consultar y eliminar cuentas.
 */
@Component({
  selector: 'app-cuentas',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cuentas.component.html',
  styleUrl: './cuentas.component.css'
})
export class CuentasComponent implements OnInit {

  constructor(
    private puenteData: PuenteDataService,
    private servicio: Cuentas
  ) { }

  // Referencias directas a elementos del DOM
  @ViewChild('Busqueda') Busqueda!: ElementRef;
  @ViewChild('saldoInicialInput') saldoInicialInput!: ElementRef;
  @ViewChild('ClaveInput') ClaveInput!: ElementRef;
  @ViewChild('noCuentaInput') noCuentaInput!: ElementRef;
  @ViewChild('TargetaInput') TargetaInput!: ElementRef;
  @ViewChild('modeloSelect') modeloSelect!: ElementRef;
  @ViewChild('monedaSelect') monedaSelect!: ElementRef;

  /** Formulario reactivo con validaciones para registrar/editar cuentas */
  formulario = signal<FormGroup>(
    new FormGroup({
      nombreBanco: new FormControl('', [Validators.required]),
      noCuenta: new FormControl(''),
      saldoInicial: new FormControl(0),
      clabe: new FormControl('', [Validators.required]),
      tarjeta: new FormControl(''),
      alias: new FormControl('', [Validators.required]),
      moneda: new FormControl('', [Validators.required]),
      modelo: new FormControl('', [Validators.required]),
      usuario: new FormControl(''),
      Id_cuenta: new FormControl(''),
      estatus: new FormControl(''),
    })
  );

  editar: boolean = true;
  Hoy: string = "";
  criterioBusqueda: string = '';
  disabledBtn: boolean = true;
  listaBusqueda: Array<any>[] = [];
  cuenta_targeta: boolean = false;
  arrayDivisa: Array<any>[] = [];
  selectModelo: boolean = true;
  arrayModelo: Array<any>[] = [];
  selectDivisa: boolean = true;

  // Inyección directa de servicios mediante inject
  private readonly _modalMsg = inject(ModalMsgService);
  private readonly _dialog = inject(MatDialog);

  /**
   * Inicializa la vista cargando datos y configuraciones necesarias.
   */
  ngOnInit(): void {
    this.SeleccionaDivisa();
    this.ModeloNegocio();
    this.setDataLogin();
    this.Hoy = this.fechaActual();
  }

  /** Muestra en consola el valor actual del formulario */
  ver() { console.log(this.formulario().value); }

  /** Emite evento para registrar en el sistema que el usuario está en la sección Cuentas */
  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Cuentas', poisionX: '' });
  }

  /** Devuelve la fecha actual con formato personalizado */
   fechaActual() {
    let fecha = '';
    var hoy = new Date();
    var ano = hoy.getFullYear();
    var mes = hoy.getMonth();
    var dia = hoy.getDate();
    var getMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return fecha = dia + ' / ' + getMes[mes] + ' / ' + ano
  }

  /** Setea el campo CLABE en el formulario reactivo */
  setFormularioClave(event: any) {
    this.formulario().patchValue({ ['clabe']: event.target.value || '' });
  }

  /** Setea el número de cuenta */
  setFormularioNoCuenta(event: any) {
    this.formulario().patchValue({ ['noCuenta']: event.target.value || '' });
  }

  /** Setea el número de tarjeta */
  setFormularioTarjeta(event: any) {
    this.formulario().patchValue({ ['tarjeta']: event.target.value || '' });
  }

  /**
   * Formatea campos bancarios agregando espacios cada cierto número de dígitos.
   * @param event Evento de entrada.
   * @param size Tamaño de agrupamiento (3 o 4 dígitos).
   * @param valor Valor manual (opcional).
   */
  formatDigitoBancarios(event: any, size: number, valor: string = '') {
    let valorMonto = event ? event.target.value : valor;
    switch (size) {
      case 3:
        valorMonto = valorMonto.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d)\.?)/g, " ");
        break;
      case 4:
        valorMonto = valorMonto.replace(/\D/g, "").replace(/\B(?=(\d{4})+(?!\d)\.?)/g, " ");
        break;
    }
    return event ? event.target.value = valorMonto : valorMonto;
  }

  /**
   * Permite ingresar solo un punto decimal en campos numéricos.
   */
  parseDigito2(event: any) {
    let cadena = event.target.value.replace(/[^0-9.]/g, "");
    let numPuntos = 0;
    for (let i = 0; i < cadena.length; i++) {
      if (cadena[0] === '.') cadena = cadena.slice(1);
      if (cadena[i] === '.' && ++numPuntos > 1) cadena = cadena.slice(0, i);
      if (cadena[i] === '.' && cadena.slice(i).length > 5) cadena = cadena.slice(0, cadena.length - 1);
    }
    event.target.value = cadena;
  }

  /** Limpia cualquier carácter no numérico o decimal al perder el foco */
  parseDigitoBlur(event: any) {
    event.target.value = event.target.value.replace(/[^0-9.]/g, "");
  }

  /**
   * Formatea el saldo ingresado como moneda y lo actualiza en el formulario.
   */
  getCurrencySaldo(event: any) {
    const value = event.target.value;
    const returnValor = value !== '' ? formatCurrency(+value, 'en', '', '', '1.2-4') : '0';
    this.formulario().patchValue({ ['saldoInicial']: returnValor.replace(/[^0-9.]/g, "") });
    event.target.value = returnValor;
  }

  /** Retorna un número como moneda formateada (hasta 4 decimales) */
  getCurrency(value: number) {
    return formatCurrency(value, 'en', '', '', '1.2-4');
  }

  /** Carga lista de modelos de negocio disponibles */
  async SeleccionaDivisa() {
    this.arrayModelo = await this.servicio.getModeloNegocio();
  }

  /** Carga lista de divisas disponibles */
  async ModeloNegocio() {
    this.arrayDivisa = await this.servicio.getDivisa();
    console.log(this.arrayDivisa);
  }

  /**
   * Envío de nuevo registro de cuenta, validando formulario y credenciales.
   */
  async enviar() {
    console.log(this.formulario().value);

    if (this.formulario().valid) {
      if (!this.formulario().get('usuario')?.value) {
        const credenciales = await this.servicio.GetCredenciales();
        this.formulario().patchValue({ usuario: credenciales.Id });
      }

      const registro = await this.servicio.AgregarCuenta(this.formulario().value);
      this._modalMsg.openModalMsg<ModalMsgComponent>(
        ModalMsgComponent,
        { data: registro.data },
        false,
        '300px',
        registro.status === 'error' ? 'error' : 'exito'
      );

      if (registro.status !== 'error') this.resetForm();
    }
  }

  /**
   * Actualiza un registro de cuenta existente si el formulario es válido.
   */
  async ActualizarRegistro() {
    if (this.formulario().valid) {
      if (!this.formulario().get('usuario')?.value) {
        const credenciales = await this.servicio.GetCredenciales();
        this.formulario().patchValue({ usuario: credenciales.Id });
      }

      const registroActualizado = await this.servicio.EnviarActualizacioCuenta(this.formulario(), BusquedaID);

      this._modalMsg.openModalMsg<ModalMsgComponent>(
        ModalMsgComponent,
        { data: registroActualizado.data },
        false,
        '300px',
        registroActualizado.status === 'error' ? 'error' : 'exito'
      );

      if (registroActualizado.status !== 'error') {
        this.resetForm();
        this.listaBusqueda = [];
      }
    }
  }

  /** Reinicia el formulario y los inputs del DOM */
  resetForm() {
    this.formulario().reset({
      nombreBanco: '', noCuenta: '', saldoInicial: 0, clabe: '', tarjeta: '',
      alias: '', moneda: '', modelo: '', usuario: '', Id_cuenta: '', estatus: ''
    });

    this.editar = true;
    this.saldoInicialInput.nativeElement.value = '';
    this.ClaveInput.nativeElement.value = '';
    this.noCuentaInput.nativeElement.value = '';
    this.TargetaInput.nativeElement.value = '';
    this.modeloSelect.nativeElement.value = '';
    this.monedaSelect.nativeElement.value = '';
    this.listaBusqueda = [];
  }

  /** Captura texto de búsqueda y habilita/deshabilita botón */
  inputBusqueda(event: any) {
    this.criterioBusqueda = event.target.value;
    this.disabledBtn = !(event.target.value.length > 0);
  }

  /**
   * Ejecuta una búsqueda de cuentas según el criterio ingresado.
   */
  async busqueda() {
    BusquedaText = this.criterioBusqueda;
    const data = await this.servicio.busqueda(this.criterioBusqueda);

    if (data.status === 'error') {
      this.listaBusqueda = [];
      this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data.data }, false, '300px', 'exito');
      this.Busqueda.nativeElement.value = '';
      this.disabledBtn = true;
      return;
    }

    this.listaBusqueda = data;
    this.Busqueda.nativeElement.value = '';
    this.disabledBtn = true;
  }

  /**
   * Abre un modal para mostrar los datos completos de una cuenta.
   */
  async verDatosCuenta(id: number) {
    const datos = await this.servicio.cargaCuentaId(id);
    if (datos.status === 'error') {
      this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: datos.data }, false, '300px', 'exito');
      return;
    }

    this._dialog.open(VentanaVerInformacionCuentas, {
      disableClose: true, data: datos, width: '705px', maxWidth: '100%'
    });
  }

  /**
   * Inicia proceso de edición mostrando un modal de confirmación.
   */
  editarCuenta(id: number) {
    const dialogRef = this._dialog.open(VentanaBusquedaCuentas, {
      disableClose: true, data: '', width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.cargaCuentaId(id).then(datos => {
          if (datos.status === 'error') {
            this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: datos.data }, false, '300px', 'exito');
            return;
          }
          this.resetForm();
          this.editar = false;
          BusquedaID = datos;
          this.cargaFormularioCuenta(datos);
        });
      }
    });
  }

  /**
   * Llena el formulario con los datos obtenidos desde el backend.
   */
  cargaFormularioCuenta(formCuenta: Array<any>) {
    formCuenta[0].clabe = this.formatDigitoBancarios(null, 3, formCuenta[0].clabe);
    formCuenta[0].noCuenta = this.formatDigitoBancarios(null, 4, formCuenta[0].noCuenta);
    formCuenta[0].tarjeta = this.formatDigitoBancarios(null, 4, formCuenta[0].tarjeta);

    formCuenta.map((item: any) => {
      this.formulario().patchValue({
        nombreBanco: item.nombreBanco,
        noCuenta: item.noCuenta,
        saldoInicial: item.saldoInicial,
        clabe: item.clabe,
        tarjeta: item.tarjeta,
        alias: item.alias,
        moneda: item.moneda,
        modelo: item.modelo,
        Id_cuenta: item.Id_cuenta,
        estatus: item.estatus,
      });
    });

    this.ClaveInput.nativeElement.value = formCuenta[0].clabe;
    this.noCuentaInput.nativeElement.value = formCuenta[0].noCuenta;
    this.TargetaInput.nativeElement.value = formCuenta[0].tarjeta;
    this.saldoInicialInput.nativeElement.value = this.getCurrency(formCuenta[0].saldoInicial);
  }

  /**
   * Elimina una cuenta tras confirmar en una ventana modal.
   */
  async eliminarCuenta(id: number) {
    const dialogRef = this._dialog.open(VentanaEliminaCuentas, {
      disableClose: true, data: '', width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicio.GetCredenciales().then(credenciales => {
          this.servicio.eliminaCuenta(id, '0', credenciales.Id).then(respuesta => {
            this._modalMsg.openModalMsg<ModalMsgComponent>(
              ModalMsgComponent,
              { data: respuesta.data },
              false,
              '300px',
              'exito'
            );

            this.servicio.busqueda(this.criterioBusqueda).then(data => {
              this.listaBusqueda = data;
            });
          });
        });
      }
    });
  }

}



// import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
// import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { PuenteDataService } from '../../core/services/puente-data.service';
// import { ModalMsgService } from '../../core/services/modal-msg.service';
// import { MatDialog } from '@angular/material/dialog';
// import { ModalMsgComponent } from '../../core/modal-msg/modal-msg.component';
// import { VentanaVerInformacionCuentas } from './ventanaVerInformacionCuentas';
// import { VentanaBusquedaCuentas } from './ventanaBusquedaCuentas';
// import { VentanaEliminaCuentas } from './ventanaEliminarCuentas';
// import { formatCurrency } from '@angular/common';
// import { Cuentas } from '../../core/services/cuentas.service';
// import { stringify } from 'querystring';

// let BusquedaText = '';
// let BusquedaID: Array<any>[] = [];

// @Component({
//   selector: 'app-cuentas',
//   standalone: true,
//   imports: [ReactiveFormsModule],
//   templateUrl: './cuentas.component.html',
//   styleUrl: './cuentas.component.css'
// })
// export class CuentasComponent implements OnInit {

//   constructor(
//     private puenteData: PuenteDataService,
//     private servicio: Cuentas
//   ) { }

//   @ViewChild('Busqueda') Busqueda!: ElementRef;
//   @ViewChild('saldoInicialInput') saldoInicialInput!: ElementRef;
//   @ViewChild('ClaveInput') ClaveInput!: ElementRef;
//   @ViewChild('noCuentaInput') noCuentaInput!: ElementRef;
//   @ViewChild('TargetaInput') TargetaInput!: ElementRef;
//   @ViewChild('modeloSelect') modeloSelect!: ElementRef;
//   @ViewChild('monedaSelect') monedaSelect!: ElementRef;

//   formulario = signal<FormGroup>(
//     new FormGroup({

//       nombreBanco: new FormControl('', [Validators.required]),
//       noCuenta: new FormControl(''),
//       saldoInicial: new FormControl(0),
//       clabe: new FormControl('', [Validators.required]),
//       tarjeta: new FormControl(''),
//       alias: new FormControl('', [Validators.required]),
//       moneda: new FormControl('', [Validators.required]),
//       modelo: new FormControl('', [Validators.required]),
//       usuario: new FormControl(''),
//       Id_cuenta: new FormControl(''),
//       estatus: new FormControl(''),

//     })
//   )

//   editar: boolean = true;
//   Hoy: string = "";
//   criterioBusqueda: string = '';
//   disabledBtn: boolean = true;
//   listaBusqueda: Array<any>[] = [];
//   cuenta_targeta: boolean = false;
//   arrayDivisa: Array<any>[] = [];
//   selectModelo: boolean = true;
//   arrayModelo: Array<any>[] = [];
//   selectDivisa: boolean = true;

//   private readonly _modalMsg = inject(ModalMsgService);
//   private readonly _dialog = inject(MatDialog);

//   ngOnInit(): void {
//     this.SeleccionaDivisa();
//     this.ModeloNegocio();
//     this.setDataLogin();
//     this.Hoy = this.fechaActual();

//   }
//   ver() { console.log(this.formulario().value) }

//   setDataLogin() {
//     this.puenteData.disparadorData.emit({ dato: 'Cuentas', poisionX: '' })
//   }

//   fechaActual() {
//     let fecha = '';
//     var hoy = new Date();
//     var ano = hoy.getFullYear();
//     var mes = hoy.getMonth();
//     var dia = hoy.getDate();
//     var getMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
//     return fecha = dia + ' / ' + getMes[mes] + ' / ' + ano
//   }

//   setFormularioClave(event: any) {
//     if (event.target.value != '') {
//       this.formulario().patchValue({ ['clabe']: event.target.value })
//       return
//     }
//     this.formulario().patchValue({ ['clabe']: '' })

//   }

//   setFormularioNoCuenta(event: any) {
//     if (event.target.value != '') {
//       this.formulario().patchValue({ ['noCuenta']: event.target.value })
//       return
//     }
//     this.formulario().patchValue({ ['noCuenta']: '' })

//   }

//   setFormularioTarjeta(event: any) {
//     if (event.target.value != '') {
//       this.formulario().patchValue({ ['tarjeta']: event.target.value })
//       return
//     }
//     this.formulario().patchValue({ ['tarjeta']: '' })

//   }

//   formatDigitoBancarios(event: any, size: number, valor: string = '') {
//     let valorMonto = event ? event.target.value : valor;

//     switch (size) {
//       case 3:
//         valorMonto = valorMonto
//           .replace(/\D/g, "")
//           .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, " ");
//         break
//       case 4:
//         valorMonto = valorMonto
//           .replace(/\D/g, "")
//           .replace(/\B(?=(\d{4})+(?!\d)\.?)/g, ` `);
//         break
//     }
//     return event ? event.target.value = valorMonto : valorMonto
//   }

//   parseDigito2(event: any) {
//     let cadena = event.target.value;
//     let numPuntos = 0
//     cadena = cadena
//       .replace(/[^0-9.]/g, "");
//     for (let i = 0; i < cadena.length; i++) {
//       if (cadena[0] === '.') {
//         cadena = cadena.slice(1)
//       }
//       if (cadena[i] === '.') {
//         numPuntos++
//         if (numPuntos > 1) {
//           cadena = cadena.slice(0, i)
//         }
//       }
//       if (cadena[i] === '.') {
//         let res = cadena.slice(i, cadena.length)
//         if (res.length > 5) {
//           cadena = cadena.slice(0, cadena.length - 1)
//         }
//       }

//     }
//     event.target.value = cadena
//   }

//   parseDigitoBlur(event: any) {
//     let valorMonto = event.target.value;
//     valorMonto = valorMonto
//       .replace(/[^0-9.]/g, "");
//     event.target.value = valorMonto
//   }

//   getCurrencySaldo(event: any) {
//     let value = event.target.value
//     let returnvalor = value
//     if (value != '') {
//       returnvalor = formatCurrency(+value, 'en', '', '', '1.2-4')
//       this.formulario().patchValue({ ['saldoInicial']: returnvalor.replace(/[^0-9.]/g, "") })
//       event.target.value = returnvalor
//       return
//     }
//     this.formulario().patchValue({ ['saldoInicial']: 0 })
//     event.target.value = returnvalor
//   }

//   getCurrency(value: number) {
//     return formatCurrency(value, 'en', '', '', '1.2-4')
//     // return formatCurrency(value, 'en', '$', '','1.2-4')
//   }


//   async SeleccionaDivisa() {
//     this.arrayModelo = await this.servicio.getModeloNegocio()
//   }

//   async ModeloNegocio() {
//     this.arrayDivisa = await this.servicio.getDivisa()
//     console.log(this.arrayDivisa)
//   }


//   async enviar() {

//     console.log(this.formulario().value)

//     if (this.formulario().valid) {

//       if (this.formulario().get('usuario')?.value === '' || this.formulario().get('usuario')?.value == null) {
//         let credenciales = await this.servicio.GetCredenciales()
//         this.formulario().patchValue({ usuario: credenciales.Id })
//       }

//       let registro = await this.servicio.AgregarCuenta(this.formulario().value)
//       if (registro.status === 'error') {
//         this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: registro.data }, false, '300px', 'error')
//         return
//       }

//       this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: registro.data }, false, '300px', 'exito')
//       this.resetForm()

//     }

//   }

//   async ActualizarRegistro() {

//     if (this.formulario().valid) {

//       if (this.formulario().get('usuario')?.value == '') {
//         let credenciales = await this.servicio.GetCredenciales()
//         this.formulario().patchValue({ usuario: credenciales.Id })
//       }

//       let registroActualizado = await this.servicio.EnviarActualizacioCuenta(this.formulario(), BusquedaID)

//       if (registroActualizado.status === 'error') {
//         this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: registroActualizado.data }, false, '300px', 'error')
//         return
//       }

//       if (registroActualizado.status === 'edicion') {
//         this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: registroActualizado.data }, false, '300px', 'exito')
//         return
//       }

//       this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: registroActualizado.data }, false, '300px', 'exito')
//       this.resetForm()
//       this.listaBusqueda = [];

//     }


//   }

//   resetForm() {

//     this.formulario().reset({
//       "nombreBanco": '',
//       "noCuenta": '',
//       "saldoInicial": 0,
//       "clabe": '',
//       "tarjeta": '',
//       "alias": '',
//       "moneda": '',
//       "modelo": '',
//       "usuario": '',
//       "Id_cuenta": '',
//       "estatus": '',
//     });

//     this.editar = true
//     this.saldoInicialInput.nativeElement.value = ''
//     this.ClaveInput.nativeElement.value = ''
//     this.noCuentaInput.nativeElement.value = ''
//     this.TargetaInput.nativeElement.value = ''
//     this.modeloSelect.nativeElement.value = ''
//     this.monedaSelect.nativeElement.value = ''
//     this.listaBusqueda = [];

//   }

//   inputBusqueda(event: any) {

//     this.criterioBusqueda = event.target.value;
//     if (event.target.value.length > 0) {
//       this.disabledBtn = false;
//       return
//     }
//     this.disabledBtn = true;
//   }

//   async busqueda() {

//     BusquedaText = this.criterioBusqueda
//     const data = await this.servicio.busqueda(this.criterioBusqueda)
//     console.log(data)
//     if (data.status === 'error') {
//       this.listaBusqueda = []
//       this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data.data }, false, '300px', 'exito')
//       this.Busqueda.nativeElement.value = '';
//       this.disabledBtn = true;
//       return
//     }
//     this.listaBusqueda = data
//     this.Busqueda.nativeElement.value = '';
//     this.disabledBtn = true;

//   }

//   async verDatosCuenta(id: number) {
//     const datos = await this.servicio.cargaCuentaId(id)
//     if (datos.status === 'error') {
//       this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: datos.data }, false, '300px', 'exito')
//       return
//     }
//     const dialogRef = this._dialog.open(VentanaVerInformacionCuentas, {
//       disableClose: true,
//       data: datos,
//       width: '705px',
//       maxWidth: '100%'
//     })

//     dialogRef.afterClosed().subscribe(result => {
//     })

//   }

//   editarCuenta(id: number) {

//     const dialogRef = this._dialog.open(VentanaBusquedaCuentas, {
//       disableClose: true,
//       data: '',
//       width: '300px',

//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.servicio.cargaCuentaId(id)
//           .then(datos => {
//             if (datos.status === 'error') {
//               this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: datos.data }, false, '300px', 'exito')
//               return
//             }
//             this.resetForm()
//             this.editar = false
//             BusquedaID = datos;
//             this.cargaFormularioCuenta(datos)
//           })
//       }
//     });

//   }

//   cargaFormularioCuenta(formCuenta: Array<any>) {

//     console.log(formCuenta)

//     formCuenta[0].clabe = this.formatDigitoBancarios(null, 3, formCuenta[0].clabe)
//     formCuenta[0].noCuenta = this.formatDigitoBancarios(null, 4, formCuenta[0].noCuenta)
//     formCuenta[0].tarjeta = this.formatDigitoBancarios(null, 4, formCuenta[0].tarjeta)

//     formCuenta.map((item: any) => {
//       this.formulario().patchValue({

//         ['nombreBanco']: item.nombreBanco,
//         ['noCuenta']: item.noCuenta,
//         ['saldoInicial']: item.saldoInicial,
//         ['clabe']: item.clabe,
//         ['tarjeta']: item.tarjeta,
//         ['alias']: item.alias,
//         ['moneda']: item.moneda,
//         ['modelo']: item.modelo,
//         ['Id_cuenta']: item.Id_cuenta,
//         ['estatus']: item.estatus,

//       })
//     })

//     this.ClaveInput.nativeElement.value = formCuenta[0].clabe
//     this.noCuentaInput.nativeElement.value = formCuenta[0].noCuenta
//     this.TargetaInput.nativeElement.value = formCuenta[0].tarjeta
//     this.saldoInicialInput.nativeElement.value = this.getCurrency(formCuenta[0].saldoInicial)

//   }

//   async eliminarCuenta(id: number) {

//     const dialogRef = this._dialog.open(VentanaEliminaCuentas, {
//       disableClose: true,
//       data: '',
//       width: '300px'
//     })
//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.servicio.GetCredenciales()
//           .then(credenciales => {

//             this.servicio.eliminaCuenta(id, '0', credenciales.Id)
//               .then(respuesta => {

//                 if (respuesta.status == 'error') {
//                   this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: respuesta.data }, false, '300px', 'exito')
//                   return
//                 }

//                 this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: respuesta.data }, false, '300px', 'exito')

//                 this.servicio.busqueda(this.criterioBusqueda)
//                   .then(data => {

//                     this.listaBusqueda = data

//                   })

//               })

//           })

//       }
//     })

//   }

// }

