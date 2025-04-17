import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { VentanaBusquedaMsg } from '../comisionistas/ventanaBusquedaMsg';
import { Inversionistas } from '../../../core/services/inversionistas.service';

// let cuenta = 1;
let porcentaje = [0, 0, 0, 0, 0]
let pocicion = [ 0, 0, 0, 0]

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

  formulario = signal<FormGroup>(
    new FormGroup({
      Id_ICPC: new FormControl(''),

      nombre: new FormControl('', [Validators.required]), //Nombre_Razon_Social
      fisica_moral: new FormControl(true),
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

      Banco_cuenta: new FormControl('', [Validators.required]),
      CLABE: new FormControl('', [Validators.required]),
      FINCASH: new FormControl(''),
      Banco_Tarjeta: new FormControl(''),
      Tarjeta: new FormControl(''),

      INE: new FormControl('', [Validators.required]),
      Comprobante_Domicilio: new FormControl('', [Validators.required]),
      Recomendado: new FormControl('',[Validators.required]),
      Fecha_Contrato: new FormControl(''),
      Calle: new FormControl('', [Validators.required]),
      No_Exterior: new FormControl(''),
      No_Interior: new FormControl(''),
      Colonia: new FormControl(''),
      Id_Estado: new FormControl('', [Validators.required]),
      Id_Municipio: new FormControl('', [Validators.required]),
      CP: new FormControl(''),

      estatus: new FormControl(''),
      Tipo_Cuenta_targeta: new FormControl('', [Validators.required]),

    })
  )
  
arrayEstado: Array<any>[] = [];
arrayRefInt: Array<any>[] = [];
arrayMunicipio: Array<any>[] = [];
arrayCuentaAsociada: Array<any>[] = [];
ComisionistaReferido: Array<any>[] = [];
listaBusqueda: Array<any>[] = [];
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
Hoy:string = "";

  private readonly _modalMsg = inject(ModalMsgService);
  private readonly _dialog = inject(MatDialog);
  
ngOnInit(): void {
  this.puenteData.disparadorData.emit({ dato: 'Inversionistas' })
  this.Hoy = this.fechaActual()
  this.estado()
  this.Referido()
  this.BRK()
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

TipoDeCuenta( event:any ){
  // deacuerdo al tipo de cuenta que selecciones en "Cuenta o tarjeta asociada" se va a abilitar los campos que estan alado y abajo
}
async estado() {

  const estado = await this.servicio.getEstado()
  this.arrayEstado = estado
  // console.log(estado)

}
async Referido() {

  // const referido = await this.servicio.getReferido()
  // this.ComisionistaReferido = referido
  // console.log(estado)

}
async BRK(  ) {

  const referido = await this.servicio.getReferidoBRK()
  this.arrayRefInt = referido
  console.log(this.arrayRefInt)
  
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
  console.log(event.target.value)
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

  this.radioBtn1.nativeElement.checked = true
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
}
ActualizarRegistro() {
    console.log(this.formulario().value)

    if ( this.formulario().valid ){

      if( this.formulario().get('usuario')?.value == null ){
        // let credenciales = await this.servicio.GetCredenciales()
        // this.formulario().patchValue({usuario:credenciales.Id})
      }

      // let registroActualizado = await this.servicio.EnviarActualizacioRegistro(this.formulario())

      // if ( registroActualizado.status === 'error' ){
      //   this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registroActualizado.data }, false, '300px', 'error' )
      //   return
      // }
      
      // this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registroActualizado.data }, false, '300px', 'exito' )
      // this.resetForm()
      this.listaBusqueda = [];
    }
}
enviar() {
    if (this.formulario().valid) {

      
      if( this.formulario().get('usuario')?.value ==='' || this.formulario().get('usuario')?.value == null){
        // let credenciales = await this.servicio.GetCredenciales()
        // this.formulario().patchValue({usuario:credenciales.Id})
      }

      // let registro = await this.servicio.AgregarComisionista( this.formulario() )
      // if ( registro.status === 'error' ){
      //   this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
      //   return
      // }
      
      // this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'exito' )
      this.resetForm()

    }

      console.log(this.formulario().value)
}
inputBusqueda(event:any) {
  // this.criterioBusqueda = event.target.value; 
  if( event.target.value.length > 0 ){
    this.disabledBtn = false;
    return
  }
  this.disabledBtn = true;
}
async busqueda(){
    // BusquedaText = this.criterioBusqueda
    // const data = await this.servicio.busqueda( this.criterioBusqueda )
    // if( data[0].length === 0 ){
    //   this.listaBusqueda = []
    //   const data = { mensaje:'No se Encontraron Coincidencias' }
    //   this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:data }, false, '300px', 'exito')
    //   this.Busqueda.nativeElement.value = '';
    //   this.disabledBtn = true;
    //   return
    // }
    // this.listaBusqueda = data
    this.Busqueda.nativeElement.value = '';
    this.disabledBtn = true;
}
  validaFecha( event:any, quien:string ){
    console.log(event.target.value)
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

  editarComisionista( id:number ){
 
    const dialogRef = this._dialog.open( VentanaBusquedaMsg, {
      disableClose:true,
      data: '',
      width: '300px',

    });
      
    dialogRef.afterClosed().subscribe(result => {
      // if(result){
      //   this.servicio.cargaComisionistaId( id )
      //   .then( datos => {
      //     if( datos.status === 'error' ){
      //       this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
      //       return
      //     }
      //     this.resetForm()
      //     this.editar = false
      //     this.cargaFormularioComisionista( datos )
      //     this.TabsInformacion.nativeElement.checked = true
      //   } )
      // }
    });

  }
  async verDatosComisionista( id:number ){
    // const datos = await this.servicio.cargaComisionistaId( id )
    // if(datos.status === 'error'){
    //   this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
    //   return
    // }
    // const dialogRef = this._dialog.open( VentanaVerInformacion, {
    //   disableClose:true,
    //   data:datos,
    //   width:'705px',
    //   maxWidth: '100%'
    // })

    // dialogRef.afterClosed().subscribe( result => {
    // })

  }
ver(){
  console.log(this.formulario().value)
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
      cuenta += 1
      break

    case 1:
      pocicion[1]=1
      this.Benef3 = false;
      cuenta += 1
      break

    case 2:
      pocicion[2]=1
      this.Benef4 = false;
      cuenta += 1
      break

    case 3:
      pocicion[3]=1
      this.Benef5 = false;
      cuenta += 1
      break

  }

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
