import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PuenteDataService } from '../../../core/services/puente-data.service';

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

// evaluaPorciento($event: Event,arg1: number) {
// throw new Error('Method not implemented.');
// }

  
  constructor(
    private puenteData: PuenteDataService,
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
      nombre: new FormControl('', [Validators.required]),
      fisica_moral: new FormControl(true, [Validators.required]),
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


      Beneficiario1: new FormControl('', [Validators.required]),
      Fecha_Nac_Beneficiario1: new FormControl('', [Validators.required]),
      Porcentaje_Beneficiario1: new FormControl('', [Validators.required]),
      
      Beneficiario2: new FormControl(''),
      // Beneficiario2: new FormControl('', [Validators.required]),
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
      
    })
  )
  
arrayEstado: Array<any>[] = [];
arrayRefInt: Array<any>[] = [];
arrayMunicipio: Array<any>[] = [];
arrayCuentaAsociada: Array<any>[] = [];
ComisionistaReferido: Array<any>[] = [];
listaBusqueda: Array<any>[] = [];
selectEstado:boolean = true;
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
async estado() {

  // const estado = await this.servicio.getEstado()
  // this.arrayEstado = estado
  // console.log(estado)

}
async Referido() {

  // const referido = await this.servicio.getReferido()
  // this.ComisionistaReferido = referido
  // console.log(estado)

}
async BRK() {

  // const referido = await this.servicio.getReferidoBRK()
  // this.arrayRefInt = referido
  // console.log(this.ReferidoBRK)
}

async Municipio(event: any) {
  const estado = this.formulario().get('Id_Estado')?.value
  // this.arrayMunicipio = await this.servicio.getMunicipio(estado)
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

SeleccionMunicipio($event: Event) {
throw new Error('Method not implemented.');
}
remplazaDigito($event: Event,arg1: string) {
throw new Error('Method not implemented.');
}

resetForm() {
throw new Error('Method not implemented.');
}
ActualizarRegistro() {
throw new Error('Method not implemented.');
}
enviar() {
throw new Error('Method not implemented.');
}
inputBusqueda($event: Event) {
throw new Error('Method not implemented.');
}
busqueda() {
throw new Error('Method not implemented.');
}
validaFecha($event: Event,arg1: string) {
  throw new Error('Method not implemented.');
}
uploadIdentificacion($event: Event) {
throw new Error('Method not implemented.');
}
eliminarBoxIdenficacion() {
throw new Error('Method not implemented.');
}
uploadDomicilio($event: Event) {
throw new Error('Method not implemented.');
}
editarComisionista(arg0: any) {
throw new Error('Method not implemented.');
}
verDatosComisionista(arg0: any) {
throw new Error('Method not implemented.');
}
ver(){
  console.log(this.formulario().value)
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
