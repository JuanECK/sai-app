import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { VentanaBusquedaInversionista } from './ventanaBusquedaInversionista'
import { Inversionistas } from '../../../core/services/inversionistas.service';

import { VentanaVerInformacionInversionista } from './ventanaVerInformacionInversionista';
import { VentanaEliminaInversionista } from './ventanaEliminarInversionista';

// let cuenta = 1;
let porcentaje = [0, 0, 0, 0, 0];
let pocicion = [ 0, 0, 0, 0];
let BusquedaText = '';
let InversionistaBusquedaID: Array<any>[] = [];
// let editedRegistro:boolean = false;

@Component({
  selector: 'app-inversionista',
  standalone:true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './inversionista.component.html',
  styleUrl: './inversionista.component.css'
})
export class InversionistaComponent implements OnInit {

  constructor(
    private puenteData: PuenteDataService,
    private servicio: Inversionistas
  ){}
  
  @ViewChild('radioBtn1') radioBtn1!: ElementRef;
  @ViewChild('radioBtn2') radioBtn2!: ElementRef;
  @ViewChild('radioNac1') radioNac1!: ElementRef;
  @ViewChild('radioNac2') radioNac2!: ElementRef;
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
  @ViewChild('brk') brk!: ElementRef;
  @ViewChild('targeta_asociada') targeta_asociada!: ElementRef;
  @ViewChild('benefScroll') benefScroll!: ElementRef;

  
  formulario = signal<FormGroup>(
    new FormGroup({
      Id_ICPC: new FormControl(''),

      nombre: new FormControl('', [Validators.required]), //Nombre_Razon_Social
      fisica_moral: new FormControl(1),
      correo: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required]),
      BRK: new FormControl('', [Validators.required]),

      usuario: new FormControl(''),

      Fecha_Nac: new FormControl('', [Validators.required]),
      RFC: new FormControl(''),
      Beneficiario1: new FormControl('', [Validators.required]),
      Fecha_Nac_Beneficiario1: new FormControl('', [Validators.required]),
      Porcentaje_Beneficiario1: new FormControl('', [Validators.required]),
      Beneficiario2: new FormControl(''),
      Fecha_Nac_Beneficiario2: new FormControl(''),
      Porcentaje_Beneficiario2: new FormControl(''),
      Beneficiario3: new FormControl(''),
      Fecha_Nac_Beneficiario3: new FormControl(''),
      Porcentaje_Beneficiario3: new FormControl(''),
      Beneficiario4: new FormControl(''),
      Fecha_Nac_Beneficiario4: new FormControl(''),
      Porcentaje_Beneficiario4: new FormControl(''),
      Beneficiario5: new FormControl(''),
      Fecha_Nac_Beneficiario5: new FormControl(''),
      Porcentaje_Beneficiario5: new FormControl(''),

      Banco_cuenta: new FormControl(''),
      CLABE: new FormControl(''),
      FINCASH: new FormControl(''),
      Banco_Tarjeta: new FormControl(''),
      Tarjeta: new FormControl(''),

      INE: new FormControl('', [Validators.required]),
      Comprobante_Domicilio: new FormControl('', [Validators.required]),
      Recomendado: new FormControl('',[Validators.required]),
      Fecha_Contrato: new FormControl(''),
      Calle: new FormControl('', [Validators.required]),
      No_Exterior: new FormControl('', [Validators.required]),
      No_Interior: new FormControl(''),
      Colonia: new FormControl('', [Validators.required]),
      Id_Estado: new FormControl('', [Validators.required]),
      Id_Municipio: new FormControl('', [Validators.required]),
      CP: new FormControl('', [Validators.required]),

      estatus: new FormControl(''),

      Tipo_Cuenta_targeta: new FormControl('', [Validators.required]),

      Id_Pais: new FormControl( '0', [Validators.required] )

    })
  )
  
arrayDataInicial: Array<any>[] = [];
arrayRefInt: Array<any>[] = [];
arrayMunicipio: Array<any>[] = [];
arrayCuentaAsociada: Array<any>[] = [];
ComisionistaReferido: Array<any>[] = [];
listaBusqueda: Array<any>[] = [];
criterioBusqueda:string = '';
selectEstado:boolean = true;
selectBRK:boolean = true;
selectMunicipio:boolean = true;
Piker: any = true;
editar: any = true;
disabledBtn: any = true;
selectReferido: boolean = true;
btnAgregaBeneficiario: boolean = true;
Benef1: boolean = true;
Benef2: boolean = true;
Benef3: boolean = true;
Benef4: boolean = true;
Benef5: boolean = true;
Banco_cuenta: boolean = true;
inst_Bancaria: boolean = true;
input_BRK: boolean = false;
titulo_cuenta_asociada:string = 'No. de cuenta o tarjeta'
placeHolder_cuenta_asociada:string = '16 ó 18 dígitos'
cuenta_targeta: boolean = false;
valor:string = ''
maxlengthCuentas!:number;
cuentaPrcentaje!:number;
nacional: boolean = false;

// actualizaRegistro:boolean = false;


Hoy:string = "";

  private readonly _modalMsg = inject(ModalMsgService);
  private readonly _dialog = inject(MatDialog);
  
ngOnInit(): void {
  this.puenteData.disparadorData.emit({ dato: 'Inversionistas', poisionX: '' })
  this.Hoy = this.fechaActual()
  this.dataInicial()
  this.BRK()

  // this.formulario().get('nombre')?.valueChanges.subscribe(selectedValue => {
  //   console.log('nombre cambio su valor')
  // })
  
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

insertaNumINV( event:any ){
  if( event.target.value === '' ){
    this.formulario().patchValue({['BRK']:''})
    return
  }
  this.formulario().patchValue({['BRK']:'INV-'+event.target.value})
}

mayus( event:any ){
  let valor = event.target.value.toUpperCase()
  return event.target.value = valor
}

async dataInicial() {

  const estado = await this.servicio.getDataInicial()
  this.arrayDataInicial = estado
  // console.log(estado)

}
// <!-- --------------------------Nacionalidad------------------ -->
evaluaNacionalidad(nacional:number){
if(nacional == 1){
  this.nacional = false
  this.formulario().patchValue({
    ['Calle']:'',
    ['No_Exterior']:'',
    ['No_Interior']:'',
    ['CP']:'',
    ['Id_Estado']:'',
    ['Id_Municipio']:'',
    ['Colonia']:'',
    ['Id_Pais']:'0',
  })
  return
}
this.nacional = true
this.formulario().patchValue({
    ['Calle']:'',
    ['No_Exterior']:'NA',
    ['No_Interior']:'NA',
    ['CP']:'NANAN',
    ['Id_Estado']:'0',
    ['Id_Municipio']:'0',
    ['Colonia']:'NA',
    ['Id_Pais']:'',
  })
}

SeleccionPais( event:any ){

}

// -------------------Tipos de cuentas asiciadas y sus variantes-----------------------
TipoDeCuenta( event:any ){

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

formatDigitoBancarios(event: any, valor: string = '') {
  let valorMonto = event ? event.target.value : valor;
  let size = this.valor == 'CLABE' ? 3 : 4;

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

cuenta_o_tarjeta( event:any ){

  // console.log(this.valor)

if( this.valor === 'Fincash' ){
  this.formulario().patchValue({['FINCASH']:event.target.value.replace(/[^0-9.]/g, ""), ['Tipo_Cuenta_targeta']:this.valor});
  this.cuenta_targeta = true
  return
}

if( this.valor === 'CLABE' ){
  this.formulario().patchValue({['CLABE']:event.target.value.replace(/[^0-9.]/g, "")});
  if( this.formulario().get('Banco_cuenta')?.value != '' ){
    
    this.cuenta_targeta = true
    this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor.replace(/[^0-9.]/g, "")});
  }
  
}else if (this.valor === 'Debito'){
  this.formulario().patchValue({['Tarjeta']:event.target.value.replace(/[^0-9.]/g, "")});
  if( this.formulario().get('Banco_Tarjeta')?.value != '' ){
    
    this.cuenta_targeta = true
    this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
    
  }
}


}

Institucion_Bancaria( event:any ){
  
  if( this.valor === 'CLABE' ){
    this.formulario().patchValue({['Banco_cuenta']:event.target.value});
    if( this.formulario().get('CLABE')?.value != '' ){
      
      this.cuenta_targeta = true
      this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
      
    }
    
  }else if (this.valor === 'Debito'){
    this.formulario().patchValue({['Banco_Tarjeta']:event.target.value});
    if( this.formulario().get('Tarjeta')?.value != '' ){
      
      this.cuenta_targeta = true
      this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
      
    }
  }

}

// ------------------------------------------------------------------------------

async BRK(  ) {

  const referido = await this.servicio.getReferidoBRK()
  this.arrayRefInt = referido
  // console.log(this.arrayRefInt)
  
}

ChangueBRK( event:any ){
  if( event.target.selectedOptions[0].text.length > 24){
    this.selectBRK = false
  }else{
    this.selectBRK = true
  }

}

async Municipio(event: any) {
  const estado = this.formulario().get('Id_Estado')?.value
  this.arrayMunicipio = await this.servicio.getMunicipio(estado)
  this.selectMunicipio = true
  this.formulario().patchValue({['Id_Municipio']:''})
  if( event.target.selectedOptions[0].text.length > 16){
    this.selectEstado = false
  }else{
    this.selectEstado = true
  }
  setTimeout(() => {
    this.mySelect.nativeElement.value = '';
  }, 100)
}

SeleccionMunicipio(event: any) {
  if( event.target.selectedOptions[0].text.length > 21){
    this.selectMunicipio = false
  }else{
    this.selectMunicipio = true
  }
}

remplazaDigito(event:any, quien:string) {
  // console.log(event.target.value)
  let valorMonto = event.target.value;
  valorMonto = valorMonto
  .replace(/\D/g, "")
  this.formulario().patchValue({[quien]:valorMonto})
}

bytesToSize(bytes: number, decimals: number = 2): string {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

resetForm() {
  this.eliminarBoxComprobante();
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
  this.selectBRK = true

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
    ['Tipo_Cuenta_targeta']:'',
    ['Id_Pais']:'0'
  });

    this.targeta_asociada.nativeElement.value=''
    this.Ref_input_Cuenta_Tarjeta.nativeElement.value=''
    this.Ref_Inst_Bancaria.nativeElement.value=''
    this.brk.nativeElement.value=''
    this.brk.nativeElement.disabled = false
    this.radioNac1.nativeElement.checked = 1


    this.input_BRK = false;
    InversionistaBusquedaID = []

    this.Benef1=true;
    this.Benef2=true;
    this.Benef3=true;
    this.Benef4=true;
    this.Benef5=true;
    this.nacional=false;

    porcentaje = [0, 0, 0, 0, 0]
    pocicion = [ 0, 0, 0, 0]

    let scrollBeneficiarios = [...document.getElementsByClassName( 'btn-nav-inversionista' )]
    scrollBeneficiarios.forEach( item => {
      item.classList.remove('activeBenef')
    } )
    this.benefScroll.nativeElement.classList.add('activeBenef')
    // this.benefScroll.nativeElement.click()
    // this.IrA( 'page-1', '1')

    // console.log(scrollBeneficiarios)
    // this.actualizaRegistro = false
}

async ActualizarRegistro() {
    // console.log(this.formulario().value)

    if ( this.formulario().valid && this.cuentaPrcentaje == 100 ){

      if(this.evaluaUsuariosFechasPrcentajes() == false){
        const data = { mensaje:'Algunos campos obligatorios relacionados con los beneficiarios no han sido completados' }
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:data }, false, '300px', 'exito' )
        // console.log( 'aun fltan datos')
        return
      }

      if( this.formulario().get('usuario')?.value == null ){
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({usuario:credenciales.Id})
      }

      // console.log( 'se envio exitoso' )
      let registroActualizado = await this.servicio.EnviarActualizacioRegistro(this.formulario(), InversionistaBusquedaID)

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
      this.listaBusqueda = [];
    }
}

async enviar() {


    if (this.formulario().valid && this.cuentaPrcentaje == 100) {

      if(this.evaluaUsuariosFechasPrcentajes() == false){
        const data = { mensaje:'Algunos campos obligatorios relacionados con los beneficiarios no han sido completados' }
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:data }, false, '300px', 'exito' )
        // console.log( 'aun fltan datos')
        return
      }

      // console.log( 'se envio exitoso' )
      
      if( this.formulario().get('usuario')?.value ==='' || this.formulario().get('usuario')?.value == null){
          let credenciales = await this.servicio.GetCredenciales()
          this.formulario().patchValue({usuario:credenciales.Id})
        }
        
        let registro = await this.servicio.AgregarInversionistas( this.formulario() )
        if ( registro.status === 'error' ){
            this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
            return
          }
          
          this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'exito' )
          this.resetForm()
   
        }
    // console.log(this.formulario().value)

}

evaluaUsuariosFechasPrcentajes(){
  let respuesta:Boolean = true

  // console.log(
  //   this.Benef2,
  //   this.Benef3,
  //   this.Benef4,
  //   this.Benef5
  // )

if( this.Benef2 == false ){
  console.log(1)
  if( this.formulario().get('Fecha_Nac_Beneficiario2')?.value == '' || this.formulario().get('Beneficiario2')?.value == '' ){
    respuesta = false
  }
}
if( this.Benef3 == false ){
  console.log(2)
  if( this.formulario().get('Fecha_Nac_Beneficiario3')?.value == '' || this.formulario().get('Beneficiario3')?.value == '' ){
    respuesta = false
  }
}
if( this.Benef4 == false ){
  console.log(4)
  if( this.formulario().get('Fecha_Nac_Beneficiario4')?.value == '' || this.formulario().get('Beneficiario4')?.value == '' ){
    respuesta = false
  }
}
if( this.Benef5 == false ){
  console.log(5)
  if( this.formulario().get('Fecha_Nac_Beneficiario5')?.value == '' || this.formulario().get('Beneficiario5')?.value == '' ){
    respuesta = false
  }
}

console.log(respuesta)
return respuesta

}

inputBusqueda(event:any) {
  this.criterioBusqueda = event.target.value; 
  // this.criterioBusqueda = ''; 
  if( event.target.value.length > 0 ){
    this.disabledBtn = false;
    return
  }
  this.disabledBtn = true;
}

cargaFormularioComisionista( formComisionista:Array<any>, dataBeneficiarios:any ){
  // console.log(formComisionista)

  // this.resetForm();
  formComisionista.map((item:any)=>{
    this.formulario().patchValue({
      ['Id_ICPC']:item.Id_ICPC,
      ['nombre']:item.nombre,
      ['fisica_moral']:item.fisica_moral,
      ['correo']:item.correo,
      ['telefono']:item.telefono,
      // ['BRK']:item.BRK,
      ['usuario']:item.usuario,
      ['Fecha_Nac']:item.Fecha_Nac,
      ['RFC']:item.RFC,

      ['Beneficiario1']:item.Beneficiario1,
      ['Fecha_Nac_Beneficiario1']:item.Fecha_Nac_Beneficiario1,
      // ['Porcentaje_Beneficiario1']:item.Porcentaje_Beneficiario1,
      ['Beneficiario2']:item.Beneficiario2,
      ['Fecha_Nac_Beneficiario2']:item.Fecha_Nac_Beneficiario2,
      // ['Porcentaje_Beneficiario2']:item.Porcentaje_Beneficiario2,
      ['Beneficiario3']:item.Beneficiario3,
      ['Fecha_Nac_Beneficiario3']:item.Fecha_Nac_Beneficiario3,
      // ['Porcentaje_Beneficiario3']:item.Porcentaje_Beneficiario3,
      ['Beneficiario4']:item.Beneficiario4,
      ['Fecha_Nac_Beneficiario4']:item.Fecha_Nac_Beneficiario4,
      // ['Porcentaje_Beneficiario4']:item.Porcentaje_Beneficiario4,
      ['Beneficiario5']:item.Beneficiario5,
      ['Fecha_Nac_Beneficiario5']:item.Fecha_Nac_Beneficiario5,
      // ['Porcentaje_Beneficiario5']:item.Porcentaje_Beneficiario5,

      ['Banco_cuenta']:item.Banco_cuenta,
      ['CLABE']:item.CLABE,
      ['FINCASH']:item.FINCASH,
      ['Banco_Tarjeta']:item.Banco_Tarjeta,
      ['Tarjeta']:item.Tarjeta,
      ['INE']:item.INE,
      ['Comprobante_Domicilio']:item.Comprobante_Domicilio,
      ['Recomendado']:item.Recomendado,
      ['Fecha_Contrato']:item.Fecha_Contrato,
      ['Calle']:item.Calle,
      ['No_Exterior']:item.No_Exterior,
      ['No_Interior']:item.No_Interior,
      ['Colonia']:item.Colonia,
      ['Id_Estado']:item.Id_Estado,
      // ['Id_Municipio']:item.Id_Municipio,
      ['CP']:item.CP,
      ['estatus']:item.Estatus,

    })
  })
  formComisionista[0].fisica_moral === '1' ? (this.radioBtn1.nativeElement.checked = true) : (this.radioBtn2.nativeElement.checked = true)
  this.servicio.getMunicipio(formComisionista[0].Id_Estado)
  .then( datosMunicipio => {
    this.arrayMunicipio = datosMunicipio;
  } )
  setTimeout(() => {
    this.formulario().patchValue({['Id_Municipio']:formComisionista[0].Id_Municipio,})
  }, 100)

  document.getElementById("boxNameCargaDomicilio")?.classList.remove('disabledBox')
  document.getElementById("boxNameCargaIdentificacion")?.classList.remove('disabledBox')
  this.inputDomicilio.nativeElement.value = formComisionista[0].Comprobante_Domicilio;
  this.inputIdentificacion.nativeElement.value = formComisionista[0].INE;

  if(formComisionista[0].Fecha_Contrato){
    this.Piker = false;
    this.FechaContrato.nativeElement.disabled = true
  }
this.formulario().patchValue({['BRK']:formComisionista[0].BRK.replace(/\D/g, "")})
  this.brk.nativeElement.value = formComisionista[0].BRK.replace(/\D/g, "")
  this.brk.nativeElement.disabled = true
  this.input_BRK = true;

  this.cargaCuentaTargeta( this.formatDigitoBancarios(null,formComisionista[0].CLABE),
     formComisionista[0].Banco_cuenta,
      this.formatDigitoBancarios(null,formComisionista[0].Tarjeta),
       formComisionista[0].Banco_Tarjeta,
        this.formatDigitoBancarios(null,formComisionista[0].FINCASH) )

  this.actualizaBeneficiario( dataBeneficiarios )
  this.cuentaPrcentaje = porcentaje[0] + porcentaje[1] + porcentaje[2] + porcentaje[3] + porcentaje[4]
  console.log(this.cuentaPrcentaje)

}


cargaCuentaTargeta( _Clave:string, _BancoCuenta:string, _tarjeta:string, _BancoTargeta:string, _fincash:string ){
  if( _Clave != '' ){
      this.formulario().patchValue({['Tipo_Cuenta_targeta']:'CLABE'})
      this.targeta_asociada.nativeElement.value ='CLABE'
      this.valor = 'CLABE';
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
    this.valor = 'Debito';
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
    this.valor = 'Fincash';
    this.Ref_input_Cuenta_Tarjeta.nativeElement.value = _fincash
    this.inst_Bancaria = true;
    this.cuenta_targeta = true
    this.Banco_cuenta = false;

    return
  }


}

async busqueda(){
    BusquedaText = this.criterioBusqueda
    // console.log(BusquedaText)
    const data = await this.servicio.busqueda( this.criterioBusqueda )
    // console.log(data)
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
}

  validaFecha( event:any, quien:string ){
    // console.log(event.target.value)
    let fecha_nacimiento = event.target.value
    var hoy = new Date();
    var cumpleanos = new Date(fecha_nacimiento);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }

    if( edad < 10 ){
      const data = { mensaje:'No se pueden registrar menores de edad' }
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:data }, false, '300px', 'exito')
      this.formulario().patchValue({[quien]:''})
      return event.target.value = ''
    }
    return
  }

  uploadIdentificacion(event: any):void {

    if (event.target.files[0] === undefined) return

    if (event.target.files[0].size > 1 * 1024 * 1024) {
      // let data = { mensaje: `Tamaño de archivo excedido: ${this.bytesToSize(event.target.files[0].size)}, !!Solo se admiten archivos de 1MB` };
      // this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, false, '300px', 'error');
      this.FileIdentificacion.nativeElement.value = "";
      return
    }

    document.getElementById("boxNameCargaIdentificacion")?.classList.remove('disabledBox')
    this.formulario().patchValue({ INE: event.target.files[0] });
    this.inputIdentificacion.nativeElement.value = event.target.files[0].name;

  }

eliminarBoxComprobante() {
  this.eliminarBoxFile('boxNameCargaDomicilio', this.inputDomicilio, this.FileDomicilio, 'Comprobante_Domicilio')
}

uploadDomicilio(event: any) {
    if (event.target.files[0] === undefined) return

    if (event.target.files[0].size > 1 * 1024 * 1024) {
      let data = { mensaje: `Tamaño de archivo excedido: ${this.bytesToSize(event.target.files[0].size)}, !!Solo se admiten archivos de 1MB` };
      this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, false, '300px', 'error');
      this.FileDomicilio.nativeElement.value = "";
      return
    }

    document.getElementById("boxNameCargaDomicilio")?.classList.remove('disabledBox')
    this.formulario().patchValue({ Comprobante_Domicilio: event.target.files[0] });
    this.inputDomicilio.nativeElement.value = event.target.files[0].name;
}

  async eliminarComisionista( id:number ){

    const dialogRef = this._dialog.open( VentanaEliminaInversionista, {
      disableClose:true,
      data:'',
      width:'300px'
    } )
    dialogRef.afterClosed().subscribe( result => {
      if( result ){
        this.servicio.GetCredenciales()
        .then( credenciales => {

          this.servicio.eliminaInversionista( id, '0', credenciales.Id )
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
    // console.log(id)

    const dialogRef = this._dialog.open( VentanaBusquedaInversionista, {
      disableClose:true,
      data: '',
      width: '300px',

    });
      
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.servicio.cargaComisionistaId( id, 'edita' )
        .then( datos => {
          if( datos.status === 'error' ){
            this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
            return
          }
          console.log(datos.busqueda)
          this.resetForm()
          this.editar = false
          InversionistaBusquedaID = datos.busqueda
          this.cargaFormularioComisionista( datos.busqueda, datos.datosBeneficiario )

          this.TabsInformacion.nativeElement.checked = true
        } )
      }
    });

  }
  async verDatosComisionista( id:number ){

    const datos = await this.servicio.cargaComisionistaId( id, 'ver' )
    if(datos.status === 'error'){
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
      return
    }
    const dialogRef = this._dialog.open( VentanaVerInformacionInversionista, {
      disableClose:true,
      data:datos,
      width:'705px',
      maxWidth: '100%'
    })

    dialogRef.afterClosed().subscribe( result => {
    })

  }

ver(){
  console.log(this.formulario().value)
  console.log(InversionistaBusquedaID)
}

eliminarBoxFile(HTMLElementBoxWho: string, HTMLElementRefFileHow: ElementRef, ElementRefHow: ElementRef, FormGroupNameKey: string) {
  document.getElementById(HTMLElementBoxWho)?.classList.add('disabledBox')
  HTMLElementRefFileHow.nativeElement.value = "";
  ElementRefHow.nativeElement.value = "";
  this.formulario().patchValue({ [FormGroupNameKey]: '' })
}

eliminarBoxIdentificacion() {
  this.eliminarBoxFile('boxNameCargaIdentificacion', this.inputIdentificacion, this.FileIdentificacion, 'INE')
}

IrA( quien:string, id:string ){

  let my_element = document.getElementById(quien);
  let element = document.getElementById(id);
  document.querySelectorAll(".btn-nav-inversionista").forEach((ele) => ele.classList.remove("activeBenef"))
  element?.classList.add('activeBenef')
  my_element?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  
}

soloDigito(event:any) {
  let valorMonto = event.target.value;
  valorMonto = valorMonto
  .replace(/\D/g, "")
  event.target.value = valorMonto 
}

actualizaBeneficiario( dataBeneficiarios:any ){
  console.log(dataBeneficiarios)

this.Benef1 = false
this.formulario().patchValue({['Porcentaje_Beneficiario1']: +dataBeneficiarios[0][`Porcentaje_Beneficiario1`]})

porcentaje[0] = +dataBeneficiarios[0][`Porcentaje_Beneficiario1`]


for( let j = 1; j < Object.keys(dataBeneficiarios[0]).length-1; j++ ){
  
  if( dataBeneficiarios[0][`Beneficiario${j+1}`]!=='' ){
    // console.log( 'entre ', j+1)
    // console.log(dataBeneficiarios[0][`Beneficiario${j+1}`])
    
    switch (j-1) {
      case 0:
        pocicion[0]=1
        this.Benef2 = false;
        this.formulario().patchValue({['Porcentaje_Beneficiario2']: +dataBeneficiarios[0][`Porcentaje_Beneficiario2`]})
        porcentaje[1] = +dataBeneficiarios[0][`Porcentaje_Beneficiario2`]
        break
        
        case 1:
          pocicion[1]=1
          this.Benef3 = false;
          this.formulario().patchValue({['Porcentaje_Beneficiario3']: +dataBeneficiarios[0][`Porcentaje_Beneficiario3`]})
          porcentaje[2] = +dataBeneficiarios[0][`Porcentaje_Beneficiario3`]
          break
          
          case 2:
            pocicion[2]=1
            this.Benef4 = false;
            this.formulario().patchValue({['Porcentaje_Beneficiario4']: +dataBeneficiarios[0][`Porcentaje_Beneficiario4`]})
            porcentaje[3] = +dataBeneficiarios[0][`Porcentaje_Beneficiario4`]
            break
            
            case 3:
              pocicion[3]=1
              this.Benef5 = false;
              this.formulario().patchValue({['Porcentaje_Beneficiario5']: +dataBeneficiarios[0][`Porcentaje_Beneficiario5`]})
              porcentaje[4] = +dataBeneficiarios[0][`Porcentaje_Beneficiario5`]
              break
              
            }
            
  }

  
  let cuenta = porcentaje[0] + porcentaje[1] + porcentaje[2] + porcentaje[3] + porcentaje[4]
  if ( cuenta >= 100){
    this.btnAgregaBeneficiario = false
    
    
    // return
  }
  
}

// setTimeout(() => {
//   editedRegistro = true
//   console.log('el registro', editedRegistro)
// }, 100)

}

agregaBeneficiario() {
  let cuenta = porcentaje[0] + porcentaje[1] + porcentaje[2] + porcentaje[3] + porcentaje[4]
  
  if ( cuenta >= 100){
    return
  }

  this.Benef1 = false
  let cont = 0
  for( let i = 0; i<pocicion.length; i++ ){
    if(pocicion[i] == 0){
      cont = i
      break
    }
  }

  switch (cont) {
    case 0:
      // this.formulario().get( 'Beneficiario2' )?.addValidators( Validators.required )
      pocicion[0]=1
      this.Benef2 = false;
      // cuenta += 1
      break

    case 1:
      pocicion[1]=1
      this.Benef3 = false;
      // cuenta += 1
      break

    case 2:
      pocicion[2]=1
      this.Benef4 = false;
      // cuenta += 1
      break

    case 3:
      pocicion[3]=1
      this.Benef5 = false;
      // cuenta += 1
      break

  }
  console.log(pocicion)

}
eliminaBeneficiario2( benef:boolean, num:number ){

  switch (num) {
    case 2:
      // this.formulario().get( 'Beneficiario2' )?.clearValidators()
      this.Benef2 = true;
      this.evaluaPorciento('', 1)
      this.formulario().patchValue({
        Beneficiario2: '',
        Fecha_Nac_Beneficiario2: '',
        Porcentaje_Beneficiario2: ''
      })
      pocicion[0]=0
      break

    case 3:
      this.Benef3 = true;
      this.evaluaPorciento('', 2)
      this.formulario().patchValue({
        Beneficiario3: '',
        Fecha_Nac_Beneficiario3: '',
        Porcentaje_Beneficiario3: ''
      })
      pocicion[1]=0
      break

    case 4:
      this.Benef4 = true;
      this.evaluaPorciento('', 3)
      this.formulario().patchValue({
        Beneficiario4: '',
        Fecha_Nac_Beneficiario4: '',
        Porcentaje_Beneficiario4: ''
      })
      pocicion[2]=0
      break

    case 5:
      this.Benef5 = true;
      this.evaluaPorciento('', 4)
      this.formulario().patchValue({
        Beneficiario5: '',
        Fecha_Nac_Beneficiario5: '',
        Porcentaje_Beneficiario5: ''
      })
      pocicion[3]=0
      break

  }

  let cuentaposicion = pocicion[0] + pocicion[1] + pocicion[2] + pocicion[3] 
  if(cuentaposicion === 0){
    this.Benef1 = true
  }
}

evaluaPorciento(event:any, id: number) {
  
  let val = event != '' ? +event.target.value : 0
  porcentaje[id] = 0
  let cuenta = porcentaje[0] + porcentaje[1] + porcentaje[2] + porcentaje[3] + porcentaje[4]
  
  cuenta = cuenta + val;
  this.cuentaPrcentaje = cuenta
  console.log(cuenta)
  if( cuenta >= 100 ){
    this.btnAgregaBeneficiario = false
  } else{
    this.btnAgregaBeneficiario = true

  }

  if (cuenta > 100) {
    return event.target.value = ''
  }
  porcentaje[id] = val
  return
}

}
