import { Component, ElementRef, inject, input, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comisionistas } from '../../../core/services/comisionistas.service';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { VentanaBusquedaMsg } from './ventanaBusquedaMsg';
import { VentanaBusquedaMsgService } from '../../../core/services/ventanaBusquedaMsg.service';



// -----------------------------------------------------------

import { MatDialog } from "@angular/material/dialog";
import { VentanaVerInformacion } from './ventanaVerInformacion';
import { VentanaCreaPortafolio } from './ventanaPortafolio';
import { VentanaEliminaMsg } from './ventanaEliminarMsg';

// -----------------------------------------------------------

let BusquedaText = ''
// let editedRegistro:boolean = false;


// const MATERIAL_MODULES = [ MatCardModule ]

@Component({
  selector: 'app-comisionistas',
  standalone: true,
  imports: [ReactiveFormsModule,],
  // imports: [ReactiveFormsModule, MATERIAL_MODULES ],
  templateUrl: './comisionistas.component.html',
  styleUrl: './comisionistas.component.css'
})
export class ComisionistasComponent implements OnInit {

  constructor(
    private puenteData: PuenteDataService,
    private servicio: Comisionistas,
  ) { }

  // @ViewChildren("radioBtn1") radioBtn1!: QueryList<ElementRef>;
  // @ViewChild('radioBtn1')
  // #radioBtn1!:ElementRef
  // @ViewChild('radioBtn2')
  // #radioBtn2!:ElementRef

  @ViewChild('radioBtn1') radioBtn1!: ElementRef;
  @ViewChild('radioBtn2') radioBtn2!: ElementRef;
  @ViewChild('mySelect') mySelect!: ElementRef;
  @ViewChild('Estado') Estado!: ElementRef;
  @ViewChild('FileDomicilio') FileDomicilio!: ElementRef;
  @ViewChild('inputDomicilio') inputDomicilio!: ElementRef;
  @ViewChild('FileIdentificacion') FileIdentificacion!: ElementRef;
  @ViewChild('inputIdentificacion') inputIdentificacion!: ElementRef;
  @ViewChild('Busqueda') Busqueda!: ElementRef;
  @ViewChild('FechaContrato') FechaContrato!: ElementRef;
  @ViewChild('TabsInformacion') TabsInformacion!: ElementRef;
  @ViewChild('comisionistaReferido') comisionistaReferido!: ElementRef;
  @ViewChild('Ref_input_Cuenta_Tarjeta') Ref_input_Cuenta_Tarjeta!: ElementRef;
  @ViewChild('Ref_Inst_Bancaria') Ref_Inst_Bancaria!: ElementRef;
  @ViewChild('targeta_asociada') targeta_asociada!: ElementRef;

  formulario = signal<FormGroup>(
    new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      fisica_moral: new FormControl(1, [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required]),
      usuario: new FormControl(''),
      banco_cuenta: new FormControl(''),
      CLABE: new FormControl(''),
      fincash: new FormControl(''),
      Banco_tarjeta: new FormControl(''),
      tarjeta: new FormControl(''),
      RFC: new FormControl(''),
      Comprobante_domicilio: new FormControl('', [Validators.required]),
      INE: new FormControl('', [Validators.required]),
      Referido: new FormControl('',[Validators.required]),
      Fecha_contrato: new FormControl(''),
      Calle: new FormControl('', [Validators.required]),
      No_Exterior: new FormControl(''),
      No_Interior: new FormControl(''),
      Colonia: new FormControl(''),
      Id_Estado: new FormControl('', [Validators.required]),
      Id_Municipio: new FormControl('', [Validators.required]),
      CP: new FormControl(''),
      estatus: new FormControl(''),
      Id_ICPC: new FormControl(''),
      
      NameDomicilio: new FormControl(''),
      NameIdentificacion: new FormControl(''),

      Tipo_Cuenta_targeta: new FormControl('', [Validators.required]),
    })
  )

  arrayEstado: Array<any>[] = [];
  arrayMunicipio: Array<any>[] = [];
  listaBusqueda: Array<any>[] = [];
  ComisionistaReferido: Array<any>[] = [];
  ReferidoBRK: Array<any>[] = [];
  criterioBusqueda:string = '';
  disabledBtn:boolean = true;
  editar:boolean = true;
  Piker:boolean = true;
  selectEstado:boolean = true;
  selectMunicipio:boolean = true;
  Hoy:string = "";
  cuenta_targeta: boolean = false;
  selectReferido: boolean = true;
  Banco_cuenta: boolean = true;
  inst_Bancaria: boolean = true;
  titulo_cuenta_asociada:string = 'No. de cuenta o tarjeta'
  placeHolder_cuenta_asociada:string = '16 ó 18 dígitos'
  maxlengthCuentas!:number;
  valor:string = ''

  // actualizaRegistro:boolean = false;

  private readonly _modalMsg = inject(ModalMsgService);
  // private readonly _ventanaBusqueda = inject(VentanaBusquedaMsgService);
  private readonly _dialog = inject(MatDialog);

  // @ViewChildren("radio") checkboxes: QueryList<ElementRef>;

  TipoDeCuenta( event:any ){

    this.Banco_cuenta = true;
    this.inst_Bancaria = true;
    this.titulo_cuenta_asociada = 'No. de cuenta o tarjeta'
    this.placeHolder_cuenta_asociada = '16 ó 18 dígitos'
    this.maxlengthCuentas = 0
    this.formulario().patchValue({
      ['fincash']:'', 
      ['CLABE']:'',
      ['banco_cuenta']:'',
      ['Banco_tarjeta']:'',
      ['tarjeta']:'',
      ['Tipo_Cuenta_targeta']:''});
  
      this.Ref_input_Cuenta_Tarjeta.nativeElement.value=''
      this.Ref_Inst_Bancaria.nativeElement.value=''
    
    this.valor = event.target.selectedOptions[0].value
    if(this.valor === 'CLABE' || this.valor === 'Debito' ){
      this.Banco_cuenta = false;
      this.inst_Bancaria = false;
      this.placeHolder_cuenta_asociada = '18 dígitos'
      if(this.valor === 'Debito' ){
         this.placeHolder_cuenta_asociada = '16 dígitos'
      }
    }else{
      this.Banco_cuenta = false;
      this.placeHolder_cuenta_asociada = '16 dígitos'
      this.titulo_cuenta_asociada = 'Tarjeta Fincash asociada'
    }
  
  }

  Institucion_Bancaria( event:any ){
  
    if( this.valor === 'CLABE' ){
      this.formulario().patchValue({['banco_cuenta']:event.target.value});
      if( this.formulario().get('CLABE')?.value != '' ){
        
        this.cuenta_targeta = true
        this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
        
      }
      
    }else if (this.valor === 'Debito'){
      this.formulario().patchValue({['Banco_tarjeta']:event.target.value});
      if( this.formulario().get('tarjeta')?.value != '' ){
        
        this.cuenta_targeta = true
        this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
        
      }
    }
  
  }

  cuenta_o_tarjeta( event:any ){

    console.log(this.valor)
  
  if( this.valor === 'Fincash' ){
    this.formulario().patchValue({['fincash']:event.target.value, ['Tipo_Cuenta_targeta']:this.valor});
    this.cuenta_targeta = true
    return
  }
  
  if( this.valor === 'CLABE' ){
    this.formulario().patchValue({['CLABE']:event.target.value});
    if( this.formulario().get('banco_cuenta')?.value != '' ){
      
      this.cuenta_targeta = true
      this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
    }
    
  }else if (this.valor === 'Debito'){
    this.formulario().patchValue({['tarjeta']:event.target.value});
    if( this.formulario().get('Banco_tarjeta')?.value != '' ){
      
      this.cuenta_targeta = true
      this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
      
    }
  }
  
  
  }

  ngOnInit(): void {
    this.setDataLogin();
    this.estado()
    this.Referido()
    this.BRK()
    this.Hoy = this.fechaActual()

    // this.formulario()?.valueChanges.subscribe(selectedValue => {
    //   console.log(editedRegistro)
  
    //   if(editedRegistro == true){
    //       // console.log(editedRegistro)
    //     console.log('nombre cambio su valor')
    //     this.actualizaRegistro = true
    //   }
    //   })
  }

  fechaActual(){ 
    let fecha = '';
    var hoy = new Date();
    var ano = hoy.getFullYear();
    var mes = hoy.getMonth();
    var dia = hoy.getDate();
    var getMes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
    return fecha = dia + ' / ' + getMes[mes] + ' / ' + ano
  }

  insertaNumBRK( event:any ){
    this.formulario().patchValue({['BRK']:'BRK-'+event.target.value})
  }

  soloDigito(event:any, size:number){
    let valorMonto = event.target.value;
    switch (size) {
      case 3:
        valorMonto = valorMonto
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, " ");
      break
      case 4:
        valorMonto = valorMonto
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{4})+(?!\d)\.?)/g, ` `);
      break
    }

    event.target.value = valorMonto  
  }

  remplazaDigito( event:any, quien:string ){
    console.log(event.target.value)
    let valorMonto = event.target.value;
    valorMonto = valorMonto
    .replace(/\D/g, "")
    this.formulario().patchValue({[quien]:valorMonto})
  }

  separarString(str:string, size:number) {
    const result = str.replace(new RegExp(`.{${size}}`, 'g'), '$&-');
    return result.substring(0, result.length % size === 0 ? result.length - 1 : result.length);
  }

  async estado() {

    const estado = await this.servicio.getEstado()
    this.arrayEstado = estado
    // console.log(estado)

  }
  
  async Referido() {

    const referido = await this.servicio.getReferido()
    this.ComisionistaReferido = referido
    // console.log(estado)

  }

  async BRK() {

    const referido = await this.servicio.getReferidoBRK()
    this.ReferidoBRK = referido
    // console.log(this.ReferidoBRK)
  }

  async Municipio( event:any ) {
    const estado = this.formulario().get('Id_Estado')?.value
    this.arrayMunicipio = await this.servicio.getMunicipio(estado)
    // console.log(event.target.selectedOptions[0].text.length)
    this.selectMunicipio = true
    if( event.target.selectedOptions[0].text.length > 16){
      this.selectEstado = false
    }else{
      this.selectEstado = true
    }
    setTimeout(() => {
      this.mySelect.nativeElement.value = '';
    }, 100)
  }

  SeleccionMunicipio( event:any ){
// console.log(event.target.selectedOptions[0].text.length)
    if( event.target.selectedOptions[0].text.length > 21){
      this.selectMunicipio = false
    }else{
      this.selectMunicipio = true
    }

  }

  inputBusqueda(event:any){

    this.criterioBusqueda = event.target.value; 
    if( event.target.value.length > 0 ){
      this.disabledBtn = false;
      return
    }
    this.disabledBtn = true;
  }


  // --------------acciones de busqueda-------------------

  portafolioInvercion( id:number ){
    // console.log(this.formulario().value)
    const dialogRef = this._dialog.open( VentanaCreaPortafolio , {
      disableClose:true,
      data:{ReferidoBRK:this.ReferidoBRK, Id_ICPC:id},
      width:'713px',
      maxWidth: '100%'
    })
  }
  
  async verDatosComisionista( id:number ){
    const datos = await this.servicio.cargaComisionistaId( id )
    if(datos.status === 'error'){
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
      return
    }
    const dialogRef = this._dialog.open( VentanaVerInformacion, {
      disableClose:true,
      data:datos,
      width:'705px',
      maxWidth: '100%'
    })

    dialogRef.afterClosed().subscribe( result => {
    })

  }


  async eliminarComisionista( id:number ){

    const dialogRef = this._dialog.open( VentanaEliminaMsg, {
      disableClose:true,
      data:'',
      width:'300px'
    } )
    dialogRef.afterClosed().subscribe( result => {
      if( result ){
        this.servicio.GetCredenciales()
        .then( credenciales => {

          this.servicio.eliminaComisionista( id, '0', credenciales.Id )
          .then( respuesta => {

            if(respuesta.status == 'error'){
              this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:respuesta.data }, false, '300px', 'exito')
              return
            }

            this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:respuesta.data }, false, '300px', 'exito')

            this.servicio.busqueda( this.criterioBusqueda )
            .then(  data => {
console.log(data)
              this.listaBusqueda = data

            } )

          } )

        } )

      }
    })
  }
  
  editarComisionista( id:number ){
 
    const dialogRef = this._dialog.open( VentanaBusquedaMsg, {
      disableClose:true,
      data: '',
      width: '300px',

    });
      
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.servicio.cargaComisionistaId( id )
        .then( datos => {
          if( datos.status === 'error' ){
            this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
            return
          }
          this.resetForm()
          this.editar = false
          this.cargaFormularioComisionista( datos )
          this.TabsInformacion.nativeElement.checked = true
        } )
      }
    });

  }



  cargaFormularioComisionista( formComisionista:Array<any> ){
    // console.log(formComisionista)

    // this.resetForm();
    formComisionista[0].map((item:any)=>{
      this.formulario().patchValue({
        ['nombre']:item.Nombre_Razon_Social,
        ['fisica_moral']:item.Fisica_Moral,
        ['correo']:item.Correo,
        ['telefono']:item.Telefono,
        // ['usuario']: item.usuario,
        ['banco_cuenta']: item.Banco_Cuenta,
        ['CLABE']: item.CLABE,
        ['fincash']: item.FINCASH,
        ['Banco_tarjeta']: item.Banco_Tarjeta,
        ['tarjeta']: item.Tarjeta,
        ['RFC']: item.RFC,
        ['Comprobante_domicilio']: item.Comprobante_domicilio,
        ['INE']: item.INE,
        ['Referido']:item.Referido_por,
        ['Fecha_contrato']: item.Fecha_Contrato,
        ['Calle']: item.Calle,
        ['No_Exterior']:item.No_Exterior,
        ['No_Interior']:item.No_Interior,
        ['Colonia']: item.Colonia,
        ['Id_Estado']:item.Id_Estado,
        // ['Id_Municipio']:item.Id_Municipio,
        ['CP']:item.CP,
        ['estatus']:item.Estatus,
        ['Id_ICPC']:item.Id_ICPC,
        
        ['NameDomicilio']: item.Comprobante_domicilio,
        ['NameIdentificacion']:item.INE,
     

      })
    })
    formComisionista[0][0].Fisica_Moral === '1' ? (this.radioBtn1.nativeElement.checked = true) : (this.radioBtn2.nativeElement.checked = true)
    this.servicio.getMunicipio(formComisionista[0][0].Id_Estado)
    .then( datosMunicipio => {
      this.arrayMunicipio = datosMunicipio;
    } )
    setTimeout(() => {
      this.formulario().patchValue({['Id_Municipio']:formComisionista[0][0].Id_Municipio,})
    }, 100)

    document.getElementById("boxNameCargaDomicilio")?.classList.remove('disabledBox')
    document.getElementById("boxNameCargaIdentificacion")?.classList.remove('disabledBox')
    this.inputDomicilio.nativeElement.value = formComisionista[0][0].Comprobante_domicilio;
    this.inputIdentificacion.nativeElement.value = formComisionista[0][0].INE;

    if(formComisionista[0][0].Fecha_Contrato){
      this.Piker = false;
      this.FechaContrato.nativeElement.disabled = true
    }
    this.cargaCuentaTargeta( formComisionista[0][0].CLABE, formComisionista[0][0].Banco_Cuenta, formComisionista[0][0].Tarjeta, formComisionista[0][0].Banco_Tarjeta, formComisionista[0][0].FINCASH )

    // setTimeout(() => {
    //   editedRegistro = true
    //   console.log('el registro', editedRegistro)
    // }, 100)
  }

  cargaCuentaTargeta( _Clave:string, _BancoCuenta:string, _tarjeta:string, _BancoTargeta:string, _fincash:string ){
    if( _Clave != '' ){
      this.formulario().patchValue({['Tipo_Cuenta_targeta']:'CLABE'})
      this.targeta_asociada.nativeElement.value ='CLABE'
      this.Ref_input_Cuenta_Tarjeta.nativeElement.value = _Clave
      this.Ref_Inst_Bancaria.nativeElement.value = _BancoCuenta
      this.inst_Bancaria = false;
      this.cuenta_targeta = true
      this.Banco_cuenta = false;

      return
    }
    if( _tarjeta != '' ){
      this.formulario().patchValue({['Tipo_Cuenta_targeta']:'Debito'})
      this.targeta_asociada.nativeElement.value ='Debito'
      this.Ref_input_Cuenta_Tarjeta.nativeElement.value = _tarjeta
      this.Ref_Inst_Bancaria.nativeElement.value = _BancoTargeta
      this.inst_Bancaria = false;
      this.cuenta_targeta = true
      this.Banco_cuenta = false;

      return
    }
    if( _fincash != '' ){
      this.formulario().patchValue({['Tipo_Cuenta_targeta']:'Fincash'})
      this.targeta_asociada.nativeElement.value ='Fincash'
      this.Ref_input_Cuenta_Tarjeta.nativeElement.value = _fincash
      this.inst_Bancaria = true;
      this.cuenta_targeta = true
      this.Banco_cuenta = false;

      return
    }




  }

  async busqueda(){
    BusquedaText = this.criterioBusqueda
    const data = await this.servicio.busqueda( this.criterioBusqueda )
    console.log(data)
    if( data.status === 'error' ){
    // if( data[0].length === 0 ){
      this.listaBusqueda = []
      // const data = { mensaje:'No se Encontraron Coincidencias' }
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:data.data }, false, '300px', 'exito')
      this.Busqueda.nativeElement.value = '';
      this.disabledBtn = true;
      return
    }
    this.listaBusqueda = data
    this.Busqueda.nativeElement.value = '';
    this.disabledBtn = true;
    // console.log(data)
  }

  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Comisionistas' })
    // this.formulario().patchValue({INE:'prueba 11111'}) ;
  }

  
  verLista() {
    
    console.log(this.formulario().value)
    // console.log(this.arrayMunicipio)
  }
  
  async ActualizarRegistro(){

    console.log(this.formulario().value)

    if ( this.formulario().valid ){

      // console.log(this.formulario().get('usuario')?.value)

      if( this.formulario().get('usuario')?.value == null ){
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({usuario:credenciales.Id})
      }

      let registroActualizado = await this.servicio.EnviarActualizacioRegistro(this.formulario())

      if ( registroActualizado.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registroActualizado.data }, false, '300px', 'error' )
        return
      }
      
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registroActualizado.data }, false, '300px', 'exito' )
      this.resetForm()
      this.listaBusqueda = [];
      // console.log(this.formulario().value)
    }


  }

  async enviar() {

    if (this.formulario().valid) {

      
      if( this.formulario().get('usuario')?.value ==='' || this.formulario().get('usuario')?.value == null){
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({usuario:credenciales.Id})
      }

      let registro = await this.servicio.AgregarComisionista( this.formulario() )
      if ( registro.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
        return
      }
      
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'exito' )
      console.log(this.formulario().value)
      this.resetForm()
      
    }

      
    }
    
    ver(){
    console.log(this.formulario().value)

  }

  resetForm() {

    this.eliminarBoxIdenficacion();
    this.eliminarBoxIdentificacion();
    this.formulario().reset();
    this.mySelect.nativeElement.value = '';
    this.Estado.nativeElement.value = '';
    this.comisionistaReferido.nativeElement.value = '';

    this.radioBtn1.nativeElement.checked = 1
    this.formulario().patchValue({fisica_moral:true})
    
    this.arrayMunicipio = []
    setTimeout(() => {
      this.mySelect.nativeElement.value = '';
    }, 100)
    this.editar = true
    this.Piker = true;
    this.FechaContrato.nativeElement.disabled = false
    this.selectEstado = true
    this.selectMunicipio = true

    this.Banco_cuenta = true;
    this.inst_Bancaria = true;
    this.titulo_cuenta_asociada = 'No. de cuenta o tarjeta'
    this.placeHolder_cuenta_asociada = '16 ó 18 dígitos'
    this.maxlengthCuentas = 0
    this.formulario().patchValue({['FINCASH']:'', 
      ['CLABE']:'',
      ['Banco_cuenta']:'',
      ['Banco_Tarjeta']:'',
      ['Tarjeta']:'',
      ['Tipo_Cuenta_targeta']:''});
  
      this.targeta_asociada.nativeElement.value=''
      this.Ref_input_Cuenta_Tarjeta.nativeElement.value=''
      this.Ref_Inst_Bancaria.nativeElement.value=''

    // this.radioBtn1.forEach((input) => {
    //   input.nativeElement.checked = true;
    // })
    // var options = document.querySelectorAll('#Municipio option');
    // this.actualizaRegistro = false

  }


  async uploadDomicilio(event: any) {

    if (event.target.files[0] === undefined) return

    if (event.target.files[0].size > 1 * 1024 * 1024) {
      let data = { mensaje: `Tamaño de archivo excedido: ${this.bytesToSize(event.target.files[0].size)}, !!Solo se admiten archivos de 1MB` };
      this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, false, '300px', 'error');
      this.FileDomicilio.nativeElement.value = "";
      return
    }

    document.getElementById("boxNameCargaDomicilio")?.classList.remove('disabledBox')
    this.formulario().patchValue({ Comprobante_domicilio: event.target.files[0] });
    this.inputDomicilio.nativeElement.value = event.target.files[0].name;


    // let dataDomicilio = await this.servicio.getComprobanteDomicilio( event.target.files[0] )

    // if(dataDomicilio.status === 'error'){
    //   const { data } = dataDomicilio
    //   this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent , { data: data }, '500px','200px' )
    //   labelNombreDomicilio!.innerHTML = '';
    //   this.FileDomicilio.nativeElement.value = "";
    // }else{
    //     this.formulario().patchValue({Comprobante_domicilio:dataDomicilio.fileName}) ;
    // }

  }


  uploadIdentificacion(event: any):void {

    if (event.target.files[0] === undefined) return

    if (event.target.files[0].size > 1 * 1024 * 1024) {
      let data = { mensaje: `Tamaño de archivo excedido: ${this.bytesToSize(event.target.files[0].size)}, !!Solo se admiten archivos de 1MB` };
      this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, false, '300px', 'error');
      this.FileIdentificacion.nativeElement.value = "";
      return
    }

    document.getElementById("boxNameCargaIdentificacion")?.classList.remove('disabledBox')
    this.formulario().patchValue({ INE: event.target.files[0] });
    this.inputIdentificacion.nativeElement.value = event.target.files[0].name;

  }

  eliminarBoxFile(HTMLElementBoxWho: string, HTMLElementRefFileHow: ElementRef, ElementRefHow: ElementRef, FormGroupNameKey: string) {
    document.getElementById(HTMLElementBoxWho)?.classList.add('disabledBox')
    HTMLElementRefFileHow.nativeElement.value = "";
    ElementRefHow.nativeElement.value = "";
    this.formulario().patchValue({ [FormGroupNameKey]: '' })
  }

  replaceNameKey = (frm: FormGroup, who: string, name: string) => {
    if (who === 'INE') {
      frm.patchValue({
        Comprobante_domicilio: name,
      })
    } else {
      frm.patchValue({
        Comprobante_domicilio: name,
      })
    }
  }


  bytesToSize(bytes: number, decimals: number = 2): string {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }


  eliminarBoxIdenficacion() {
    this.eliminarBoxFile('boxNameCargaDomicilio', this.inputDomicilio, this.FileDomicilio, 'Comprobante_domicilio')
  }
  eliminarBoxIdentificacion() {
    this.eliminarBoxFile('boxNameCargaIdentificacion', this.inputIdentificacion, this.FileIdentificacion, 'INE')
  }

}





function dataDomicilio(valor: any) {
  console.log(valor)
  if (valor.options.length > 10) { valor.size = 10 }
}

// fileName: "c9dde32d-f213-494f-9750-2459b03d2d22.pdf"
