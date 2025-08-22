import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { PuenteDataService } from '../../../core/services/puente-data.service';
import { Publico } from '../../../core/services/publico.service';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { VentanaEliminaPublico } from './ventanaEliminarProveedor';
import { VentanaVerInformacionPublico } from './ventanaVerInformacionProveedor';
import { VentanaBusquedaPublico } from './ventanaBusquedaProveedor';
import { MatDialog } from '@angular/material/dialog';
import { BlobOptions } from 'buffer';
import { formatCurrency } from '@angular/common';

let BusquedaText = '';
let BusquedaID: Array<any>[] = [];


@Component({
  selector: 'app-publico',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './publico.component.html',
  styleUrl: './publico.component.css'
})

export class PublicoComponent implements OnInit{

  constructor(
    private puenteData: PuenteDataService,
    private servicio:Publico
  ){}

  @ViewChild('radioBtn1') radioBtn1!: ElementRef;
  @ViewChild('radioBtn2') radioBtn2!: ElementRef;
  @ViewChild('Busqueda') Busqueda!: ElementRef;
  @ViewChild('Ref_input_Cuenta_Tarjeta') Ref_input_Cuenta_Tarjeta!: ElementRef;
  @ViewChild('Ref_Inst_Bancaria') Ref_Inst_Bancaria!: ElementRef;
  @ViewChild('targeta_asociada') targeta_asociada!: ElementRef;
  @ViewChild('Catalogo') Catalogo!: ElementRef;
  @ViewChild('Monto') Monto!: ElementRef;
  @ViewChild('TipoDivisa') TipoDivisa!: ElementRef;


  formulario = signal<FormGroup>(
    new FormGroup({
      nombre: new FormControl( '', [Validators.required]),
      fisica_moral: new FormControl( 1, ),
      correo: new FormControl( '' ),
      telefono: new FormControl( '' ),
      Id_ICPC: new FormControl( '' ),
      Banco_cuenta: new FormControl( '' ),
      CLABE: new FormControl( '' ),
      FINCASH: new FormControl( '' ),
      Banco_tarjeta: new FormControl( '' ),
      tarjeta: new FormControl( '' ),
      Estatus: new FormControl( '' ),
      usuario: new FormControl( '' ),
      tipoClienteDivisa : new FormControl(0),
      tipoDivisa : new FormControl(0),
      saldoApertura: new FormControl(0),
      utilidad: new FormControl('', [Validators.required]),
      comision : new FormControl('', [Validators.required]),

    })
  )

  editar:boolean = true;
  Hoy:string = "";
  selectReferido: boolean = true;
  Banco_cuenta: boolean = true;
  inst_Bancaria: boolean = true;
  titulo_cuenta_asociada:string = 'No. de cuenta o tarjeta'
  placeHolder_cuenta_asociada:string = '16 ó 18 dígitos'
  maxlengthCuentas!:number;
  valor:string = ''
  criterioBusqueda:string = '';
  disabledBtn:boolean = true;
  listaBusqueda: Array<any>[] = [];

  catalogoDivisas: Array<any>[] = [];
  divisa: Array<any>[] = [];
  array: Array<any>[] = [];

  cataDivisa:boolean = true
  saldoDivisa:boolean = false

  private readonly _modalMsg = inject(ModalMsgService);
  private readonly _dialog = inject(MatDialog);

  ngOnInit(): void {
    this.setDataLogin();
    this.cargaDataInicial();
    this.Hoy = this.fechaActual()
    this.formulario().patchValue({['utilidad']:0, ['comision']:0})
  }

  async cargaDataInicial(){
    this.array = await this.servicio.GetDataInicial();
  }

  ver(){console.log(this.formulario().value)}

  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Público' , poisionX: '' })
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

evaluaCatalogo( event:any ){

  if( event.target.value == 0 ){

    // console.log(1)
    this.formulario().patchValue({['tipoClienteDivisa']: 0, ['tipoDivisa']:'', ['saldoApertura']:0, ['utilidad']:0, ['comision']:0})
    this.Monto.nativeElement.value = ''
    this.TipoDivisa.nativeElement.value = ''
    event.target.value = ''
    this.cataDivisa = true
    this.saldoDivisa = false
    return 
  }
  if( event.target.value == 2 || event.target.value == 0 ){
    
    // console.log(2)
    this.cataDivisa = true
    this.saldoDivisa = false
    this.formulario().patchValue({['tipoDivisa']:'', ['saldoApertura']:0, ['utilidad']:0, ['comision']:0})
    this.Monto.nativeElement.value = ''
    this.TipoDivisa.nativeElement.value = ''
    return
  }
  // else{
  //   this.cataDivisa = false
  // }
  if(event.target.value == 11){
    // console.log(3)
    this.saldoDivisa = true
     this.formulario().patchValue({['tipoDivisa']:0, ['saldoApertura']:0, ['utilidad']:'', ['comision']:''})
    this.Monto.nativeElement.value = ''
    this.TipoDivisa.nativeElement.value = ''
    return
  }
  
  // console.log(4)
  this.saldoDivisa = false
  this.cataDivisa = false
  this.formulario().patchValue({['tipoClienteDivisa']: event.target.value})
}

evaluaDivisa( event:any ){
  if( event.target.value == 0 ){
    this.formulario().patchValue({['tipoDivisa']: ''})
    event.target.value = ''
    return 
  }
  this.formulario().patchValue({['tipoDivisa']: event.target.value})
  
}

  getCurrencySaldo(event: any) {
    let value = event.target.value
    let returnvalor = value
    if (value != '') {
      returnvalor = formatCurrency(+value, 'en', '', '', '1.2-4')
      this.formulario().patchValue({ ['saldoApertura']: returnvalor.replace(/[^0-9.]/g, "") })
      event.target.value = returnvalor
      return
    }
    this.formulario().patchValue({ ['saldoApertura']: 0 })
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

  TipoDeCuenta( event:any ){

    this.Banco_cuenta = true;
    this.inst_Bancaria = true;
    this.titulo_cuenta_asociada = 'No. de cuenta o tarjeta'
    this.placeHolder_cuenta_asociada = '16 ó 18 dígitos'
    this.maxlengthCuentas = 0
    this.formulario().patchValue({
      ['FINCASH']:'', 
      ['CLABE']:'',
      ['Banco_cuenta']:'',
      ['Banco_tarjeta']:'',
      ['tarjeta']:'',
      // ['Tipo_Cuenta_targeta']:''
    });
  
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
      this.formulario().patchValue({['Banco_cuenta']:event.target.value});
      // if( this.formulario().get('CLABE')?.value != '' ){
        
        // this.cuenta_targeta = true
        // this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
        
      // }
      
    }else if (this.valor === 'Debito'){
      this.formulario().patchValue({['Banco_tarjeta']:event.target.value});
      // if( this.formulario().get('tarjeta')?.value != '' ){
        
        // this.cuenta_targeta = true
        // this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
        
      // }
    }
  
  }

  formatDigitoBancarios(event: any, valor: string = '', sizeN:number ) {
    let valorMonto = event ? event.target.value : valor;
    let size = sizeN == 0 ? (this.valor == 'CLABE' ? 3 : 4) : ( sizeN ); 

    console.log(size)

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

    console.log(this.valor)
  
  if( this.valor === 'Fincash' ){
    this.formulario().patchValue({
      ['FINCASH']:event.target.value.replace(/[^0-9.]/g, ""), 
      // ['Tipo_Cuenta_targeta']:this.valor
      });
    // this.cuenta_targeta = true
    return
  }
  
  if( this.valor === 'CLABE' ){
    this.formulario().patchValue({['CLABE']:event.target.value.replace(/[^0-9.]/g, "")});
    // if( this.formulario().get('banco_cuenta')?.value != '' ){
      
      // this.cuenta_targeta = true
      // this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor.replace(/[^0-9.]/g, "")});
    // }
    
  }else if (this.valor === 'Debito'){
    this.formulario().patchValue({['tarjeta']:event.target.value.replace(/[^0-9.]/g, "")});
    // if( this.formulario().get('Banco_tarjeta')?.value != '' ){
      
      // this.cuenta_targeta = true
      // this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
      
    // }
  }
  
  
  }

  // Institucion_Bancaria( event:any ){
  
  //   if( this.targeta_asociada.nativeElement.value === 'CLABE' ){
  //     // console.log(event.target.value)
  //     this.formulario().patchValue({['Banco_cuenta']:event.target.value});
  //     // if( this.formulario().get('CLABE')?.value != '' ){
        
  //     //   this.cuenta_targeta = true
  //     //   // this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
        
  //     // }
      
  //   }else if (this.targeta_asociada.nativeElement.value === 'Debito'){
  //     this.formulario().patchValue({['Banco_tarjeta']:event.target.value});
  //     // if( this.formulario().get('tarjeta')?.value != '' ){
        
  //     //   this.cuenta_targeta = true
  //     //   // this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
        
  //     // }
  //   }
  
  // }

  // cuenta_o_tarjeta( event:any ){

  //   console.log(this.targeta_asociada.nativeElement.value)
  
  // if( this.targeta_asociada.nativeElement.value === 'Fincash' ){
  //   this.formulario().patchValue({['FINCASH']:event.target.value, 
  //     // ['Tipo_Cuenta_targeta']:this.valor
  //   });
  //   // this.cuenta_targeta = true
  //   return
  // }
  
  // if( this.targeta_asociada.nativeElement.value === 'CLABE' ){
  //   this.formulario().patchValue({['CLABE']:event.target.value});
  //   // if( this.formulario().get('banco_cuenta')?.value != '' ){
      
  //   //   this.cuenta_targeta = true
  //   //   // this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
  //   // }
    
  // }else if (this.targeta_asociada.nativeElement.value === 'Debito'){
  //   this.formulario().patchValue({['tarjeta']:event.target.value});
  //   // if( this.formulario().get('Banco_tarjeta')?.value != '' ){
      
  //   //   this.cuenta_targeta = true
  //   //   // this.formulario().patchValue({['Tipo_Cuenta_targeta']:this.valor});
      
  //   // }
  // }
  
  
  // }

  async enviar() {
  
      if (this.formulario().valid) {
  
        
        if( this.formulario().get('usuario')?.value ==='' || this.formulario().get('usuario')?.value == null){
          let credenciales = await this.servicio.GetCredenciales()
          this.formulario().patchValue({usuario:credenciales.Id})
        }
  
        let registro = await this.servicio.AgregarProveedor( this.formulario().value )
        if ( registro.status === 'error' ){
          this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
          return
        }
        
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'exito' )
        // console.log(this.formulario().value)
        this.resetForm()
        
      }
  
        
  }

    async ActualizarRegistro(){
  
      // console.log(this.formulario().value)
  
      if ( this.formulario().valid ){
  
        if( this.formulario().get('usuario')?.value == null ){
          let credenciales = await this.servicio.GetCredenciales()
          this.formulario().patchValue({usuario:credenciales.Id})
        }
        if( this.Monto.nativeElement.value == '' ){this.formulario().patchValue({['saldoApertura']:0})}
  
        let registroActualizado = await this.servicio.EnviarActualizacioProveedor(this.formulario(), BusquedaID)

  
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

  resetForm() {

    this.formulario().reset({
      'nombre':'',
      'fisica_moral':1,
      'correo':'',
      'telefono':'',
      'Id_ICPC':'',
      'Banco_cuenta':'',
      'CLABE':'',
      'FINCASH':'',
      'Banco_tarjeta':'',
      'tarjeta':'',
      'Estatus':'',
      'usuario':'',
      'tipoClienteDivisa':0,
      'tipoDivisa':'',
      'saldoApertura':0,
      ['utilidad']:'', 
      ['comision']:''
    });

    this.radioBtn1.nativeElement.checked = 1
    this.formulario().patchValue({fisica_moral:true})
    this.editar = true

    this.cataDivisa = true
    this.saldoDivisa = false
    this.Banco_cuenta = true;
    this.inst_Bancaria = true;
    this.titulo_cuenta_asociada = 'No. de cuenta o tarjeta'
    this.placeHolder_cuenta_asociada = '16 ó 18 dígitos'
    this.maxlengthCuentas = 0
    // this.formulario().patchValue({



    //   ['FINCASH']:'', 
    //   ['CLABE']:'',
    //   ['Banco_cuenta']:'',
    //   ['Banco_Tarjeta']:'',
    //   ['tarjeta']:'',
    //   // ['tipoClienteDivisa']:'',
    //   // ['tipoDivisa']:'',
    //   // ['saldoApertura']:'',
      
    // });
  
      this.targeta_asociada.nativeElement.value=''
      this.Ref_input_Cuenta_Tarjeta.nativeElement.value=''
      this.Ref_Inst_Bancaria.nativeElement.value=''

       this.cataDivisa = true
      this.Catalogo.nativeElement.value = ''
      this.Monto.nativeElement.value = ''
      this.TipoDivisa.nativeElement.value = ''

      this.listaBusqueda = [];

  }

  inputBusqueda(event:any){

    this.criterioBusqueda = event.target.value; 
    if( event.target.value.length > 0 ){
      this.disabledBtn = false;
      return
    }
    this.disabledBtn = true;
  }

    async busqueda(){
      BusquedaText = this.criterioBusqueda
      const data = await this.servicio.busqueda( this.criterioBusqueda )
      console.log(data)
      if( data.status === 'error' ){
        this.listaBusqueda = []
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:data.data }, false, '300px', 'exito')
        this.Busqueda.nativeElement.value = '';
        this.disabledBtn = true;
        return
      }
      this.listaBusqueda = data
      this.Busqueda.nativeElement.value = '';
      this.disabledBtn = true;
      
    }

      async verDatosProveedor( id:number ){
        let datos = await this.servicio.cargaProveedorId( id )
        let item = this.array[0].filter(item => item.Id_Tipo_ClienteDivisa == datos[0].Id_Tipo_ClienteDivisa)
        console.log({ver:item})

        datos[0] = { TipoPerfil:item[0].TipoPerfil, ...datos[0] } 
        if(datos.status === 'error'){
          this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
          return
        }
        const dialogRef = this._dialog.open( VentanaVerInformacionPublico, {
          disableClose:true,
          data:datos,
          width:'705px',
          maxWidth: '100%'
        })
    
        dialogRef.afterClosed().subscribe( result => {
        })
    
      }

        editarProveedor( id:number ){
       
          const dialogRef = this._dialog.open( VentanaBusquedaPublico, {
            disableClose:true,
            data: '',
            width: '300px',
      
          });
            
          dialogRef.afterClosed().subscribe(result => {
            if(result){
              this.servicio.cargaProveedorId( id )
              .then( datos => {
                if( datos.status === 'error' ){
                  this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos.data }, false, '300px', 'exito')
                  return
                }
                this.resetForm()
                this.editar = false
                BusquedaID = datos;
                this.cargaFormularioProveedor( datos )
              } )
            }
          });
      
        }

        cargaFormularioProveedor( formProveedor:Array<any> ){

          // console.log(formProveedor)
 
          formProveedor.map((item:any)=>{
            this.formulario().patchValue({

              ['nombre']:item.nombre,
              ['fisica_moral']:item.fisica_moral,
              ['correo']:item.correo,
              ['telefono']:item.telefono,
              ['Id_ICPC']:item.Id_ICPC,
              ['Banco_cuenta']:item.Banco_cuenta,
              ['CLABE']:item.CLABE,
              ['FINCASH']:item.FINCASH,
              ['Banco_tarjeta']:item.Banco_Tarjeta,
              ['tarjeta']:item.tarjeta,
              ['Estatus']:item.Estatus,
              ['usuario']:item.usuario,
              ['tipoClienteDivisa']:item.Id_Tipo_ClienteDivisa,
              ['tipoDivisa']:item.Id_Moneda,
              ['saldoApertura']:item.Saldo_Apertura,
              ['utilidad']:item.utilidad,
              ['comision']:item.comision,

            })
          })

          if( formProveedor[0].Id_Tipo_ClienteDivisa == 1  ) {
            this.cataDivisa = false;
            // this.formulario().patchValue({
            //   // ['tipoDivisa']:formProveedor[0].Id_Moneda,
            //   // ['saldoApertura']:formProveedor[0].Saldo_Apertura,
            // })
            this.Monto.nativeElement.value = formatCurrency(formProveedor[0].Saldo_Apertura, 'en', '', '', '1.2-4')
            this.TipoDivisa.nativeElement.value = formProveedor[0].Id_Moneda;

          }
          formProveedor[0].fisica_moral === '1' ? (this.radioBtn1.nativeElement.checked = true) : (this.radioBtn2.nativeElement.checked = true)
          this.cargaCuentaTargeta( formProveedor[0].CLABE, formProveedor[0].Banco_cuenta, formProveedor[0].tarjeta, formProveedor[0].Banco_Tarjeta, formProveedor[0].FINCASH )

          if (formProveedor[0].Id_Tipo_ClienteDivisa == 11) {
            this.saldoDivisa = true
          }

        }



        cargaCuentaTargeta( _Clave:string, _BancoCuenta:string, _tarjeta:string, _BancoTargeta:string, _fincash:string ){
          if( _Clave != '' ){
            // this.formulario().patchValue({['Tipo_Cuenta_targeta']:'CLABE'})
            this.valor = 'CLABE'
            this.targeta_asociada.nativeElement.value ='CLABE'
            this.Ref_input_Cuenta_Tarjeta.nativeElement.value = this.formatDigitoBancarios( null, _Clave, 3 )
            this.Ref_Inst_Bancaria.nativeElement.value = _BancoCuenta
            this.inst_Bancaria = false;
            // this.cuenta_targeta = true
            this.Banco_cuenta = false;
      
            return
          }
          if( _tarjeta != '' ){
            // this.formulario().patchValue({['Tipo_Cuenta_targeta']:'Debito'}) 
            this.valor = 'Debito'
            this.targeta_asociada.nativeElement.value ='Debito'
            this.Ref_input_Cuenta_Tarjeta.nativeElement.value = this.formatDigitoBancarios( null, _tarjeta, 4 )
            this.Ref_Inst_Bancaria.nativeElement.value = _BancoTargeta
            this.inst_Bancaria = false;
            // this.cuenta_targeta = true
            this.Banco_cuenta = false;
      
            return
          }
          if( _fincash != '' ){
            // this.formulario().patchValue({['Tipo_Cuenta_targeta']:'Fincash'})
            this.valor = 'Fincash'
            this.targeta_asociada.nativeElement.value ='Fincash'
            this.Ref_input_Cuenta_Tarjeta.nativeElement.value = this.formatDigitoBancarios( null, _fincash, 4 )
            this.inst_Bancaria = true;
            // this.cuenta_targeta = true
            this.Banco_cuenta = false;
      
            return
          }
      
      
      
      
        }

          async eliminarProveedor( id:number ){
        
            const dialogRef = this._dialog.open( VentanaEliminaPublico, {
              disableClose:true,
              data:'',
              width:'300px'
            } )
            dialogRef.afterClosed().subscribe( result => {
              if( result ){
                this.servicio.GetCredenciales()
                .then( credenciales => {
        
                  this.servicio.eliminaProveedor( id, '0', credenciales.Id )
                  .then( respuesta => {
        
                    if(respuesta.status == 'error'){
                      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:respuesta.data }, false, '300px', 'error')
                      return
                    }
        
                    this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:respuesta.data }, false, '300px', 'exito')
        
                    this.servicio.busqueda( this.criterioBusqueda )
                    .then(  data => {
                      // console.log({'respuesta busqueda':data})
                      this.listaBusqueda = data
        
                    } )
        
                  } )
        
                } )
        
              }
            })
          }


}
