import { Component, ElementRef, inject, input, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comisionistas } from '../../../core/services/comisionistas.service';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { MatCardModule } from '@angular/material/card';

// const MATERIAL_MODULES = [ MatCardModule ]

@Component({
  selector: 'app-comisionistas',
  standalone: true,
  imports: [ReactiveFormsModule],
  // imports: [ReactiveFormsModule, MATERIAL_MODULES ],
  templateUrl: './comisionistas.component.html',
  styleUrl: './comisionistas.component.css'
})
export class ComisionistasComponent implements OnInit {

  constructor(
    private puenteData: PuenteDataService,
    private servicio: Comisionistas,
  ) { }

  @ViewChildren("radioBtn1") radioBtn1!: QueryList<ElementRef>;
  // @ViewChild('radioBtn1')
  // #radioBtn1!:ElementRef
  // @ViewChild('radioBtn2')
  // #radioBtn2!:ElementRef

  @ViewChild('mySelect') mySelect!: ElementRef;
  @ViewChild('Estado') Estado!: ElementRef;
  @ViewChild('FileDomicilio') FileDomicilio!: ElementRef;
  @ViewChild('inputDomicilio') inputDomicilio!: ElementRef;
  @ViewChild('FileIdentificacion') FileIdentificacion!: ElementRef;
  @ViewChild('inputIdentificacion') inputIdentificacion!: ElementRef;

  formulario = signal<FormGroup>(
    new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      fisica_moral: new FormControl('', [Validators.required]),
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
      Referido: new FormControl(''),
      Fecha_contrato: new FormControl(''),
      Calle: new FormControl('', [Validators.required]),
      No_Exterior: new FormControl(''),
      No_Interior: new FormControl(''),
      Colonia: new FormControl(''),
      Id_Estado: new FormControl('', [Validators.required]),
      Id_Municipio: new FormControl('', [Validators.required]),
      CP: new FormControl(''),
    })
  )


  arrayEstado: Array<any>[] = []
  arrayMunicipio: Array<any>[] = []

  private readonly _modalMsg = inject(ModalMsgService);

  // @ViewChildren("radio") checkboxes: QueryList<ElementRef>;



  ngOnInit(): void {
    this.setDataLogin();
    this.estado()

  }

  async estado() {

    const estado = await this.servicio.getEstado()
    this.arrayEstado = estado
    console.log(estado)

  }

  async Municipio() {
    console.log()
    const estado = this.formulario().get('Id_Estado')?.value
    this.arrayMunicipio = await this.servicio.getMunicipio(estado)
    // console.log(this.arrayMunicipio)
    setTimeout(() => {
      this.mySelect.nativeElement.value = '';
    }, 100)
  }

  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Comisionistas' })
    // this.formulario().patchValue({INE:'prueba 11111'}) ;
  }

  ver() {

    console.log(this.formulario().value)
    console.log(this.arrayMunicipio)
  }

  async enviar() {

    if (this.formulario().valid) {

      let credenciales = await this.servicio.GetCredenciales()

      if( this.formulario().get('usuario')?.value === '' ){
        console.log('entre')
        this.formulario().patchValue({usuario:credenciales.Id})
      }

    }

      let registro = await this.servicio.AgregarComisionista( this.formulario() )
      if ( registro.status === 'error' ){
         this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, '500px' )
         return
      }

      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, '500px' )

      // let dataDomicilio = await this.servicio.getComprobante( this.formulario().get('Comprobante_domicilio')?.value )
      // if(dataDomicilio.status === 'error'){
      //   this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: dataDomicilio.data }, '500px', '200px');
      //   return
      // }

      // this.formulario().patchValue({Comprobante_domicilio:dataDomicilio.fileName})
  
      // let dataIdentificacion = await this.servicio.getComprobante( this.formulario().get('INE')?.value )
      // if(dataIdentificacion.status === 'error'){
      //   this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: dataIdentificacion.data }, '500px', '200px');
      //   return
      // }
  
      // this.formulario().patchValue({INE:dataIdentificacion.fileName})

      // console.log('enviar')
      // console.log(this.formulario().value)
      
      
    // }
    


    // console.log(this.formulario().value)
    // this.puenteData.disparadorLogin.subscribe(data => {
    //   console.log(data)
    // })
  }

  cancelar() {
    this.formulario().reset();
    this.mySelect.nativeElement.value = '';
    this.Estado.nativeElement.value = '';

    this.radioBtn1.forEach((input) => {
      input.nativeElement.checked = false;
    })

    this.arrayMunicipio = []
    setTimeout(() => {
      this.mySelect.nativeElement.value = '';
    }, 100)

    // var options = document.querySelectorAll('#Municipio option');

  }


  async uploadDomicilio(event: any) {

    if (event.target.files[0] === undefined) return

    if (event.target.files[0].size > 1 * 1024 * 1024) {
      let data = { error: `Tamaño de archivo excedido: ${this.bytesToSize(event.target.files[0].size)}, !!Solo se admiten archivos de 1MB` };
      this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, '500px', '200px');
      // this.FileDomicilio.nativeElement.value = "";
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
      let data = { error: `Tamaño de archivo excedido: ${this.bytesToSize(event.target.files[0].size)}, !!Solo se admiten archivos de 1MB` };
      this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data }, '500px', '200px');
      // this.FileIdentificacion.nativeElement.value = "";
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
