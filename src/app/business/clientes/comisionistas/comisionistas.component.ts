import { Component, ElementRef, input, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comisionistas } from '../../../core/services/comisionistas.service';

@Component({
  selector: 'app-comisionistas',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './comisionistas.component.html',
  styleUrl: './comisionistas.component.css'
})
export class ComisionistasComponent implements OnInit {

  constructor(
    private puenteData:PuenteDataService,
    private servicio:Comisionistas,
  ){}

  @ViewChildren("radioBtn1") radioBtn1!: QueryList<ElementRef>;
  // @ViewChild('radioBtn1')
  // #radioBtn1!:ElementRef
  // @ViewChild('radioBtn2')
  // #radioBtn2!:ElementRef

  @ViewChild('mySelect') mySelect!: ElementRef;
  @ViewChild('Estado') Estado!: ElementRef;

  formulario = signal<FormGroup>(
    new FormGroup({
      nombre: new FormControl( '', [ Validators.required ] ),
      fisica_moral: new FormControl('', [ Validators.required ]),
      correo: new FormControl( '', [ Validators.required ] ),
      telefono: new FormControl( '', [ Validators.required ] ),
      usuario: new FormControl( '' ),
      banco_cuenta: new FormControl( '' ),
      CLABE: new FormControl( '' ),
      fincash: new FormControl( '' ),
      Banco_tarjeta: new FormControl( '' ),
      tarjeta: new FormControl( '' ),
      RFC: new FormControl( '', [ Validators.required ] ),
      Comprobante_domicilio: new FormControl( '' ),
      INE: new FormControl( '' ),
      Referido: new FormControl( '' ),
      Fecha_contrato: new FormControl( '' ),
      Calle: new FormControl( '', [ Validators.required ] ),
      No_Exterior: new FormControl( '' ),
      No_Interior: new FormControl( '' ),
      Colonia: new FormControl( '' ),
      Id_Estado: new FormControl( '', [ Validators.required ] ),
      Id_Municipio: new FormControl( '', [ Validators.required ] ),
      CP: new FormControl( '' ),
    })
  )

  
  arrayEstado:Array<any>[] = []
  arrayMunicipio:Array<any>[] = []


  // @ViewChildren("radio") checkboxes: QueryList<ElementRef>;
  
  

  ngOnInit(): void {
    this.setDataLogin();
    this.estado()
   
  }

  async estado(){

    const estado  =  await this.servicio.getEstado()
    this.arrayEstado = estado
    console.log(estado)
    
  }

  async Municipio(){
    console.log()
    const estado = this.formulario().get('Id_Estado')?.value
    this.arrayMunicipio = await this.servicio.getMunicipio( estado )
    // console.log(this.arrayMunicipio)
    setTimeout(()=>{
      this.mySelect.nativeElement.value = '';
    },100)
  }

  setDataLogin() {
    this.puenteData.disparadorData.emit({dato:'Comisionistas'})
   }

   ver(){
    console.log(this.formulario().value)
    console.log(this.arrayMunicipio)
   }

   enviar(){
    if( this.formulario().valid) {
      console.log('enviar')
    }
    // alert('Faltan campos por llenar')
   }
   cancelar(){
    this.formulario().reset();
    this.mySelect.nativeElement.value = '';
    this.Estado.nativeElement.value = '';
    
    this.radioBtn1.forEach((input) => {
      input.nativeElement.checked = false;
    })
    
    this.arrayMunicipio = []
    setTimeout(()=>{
      this.mySelect.nativeElement.value = '';
    },100)

    // var options = document.querySelectorAll('#Municipio option');
    
   }

}
function prueba (valor:any) {
  console.log(valor)
  if(valor.options.length>10){valor.size=10 }
}