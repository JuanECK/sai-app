import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Prestamos } from '../../../core/services/movPrestamos.service';
import { PuenteDataService } from '../../../core/services/puente-data.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalMsgService } from '../../../core/services/modal-msg.service';
import { MatDialog } from '@angular/material/dialog';
import { formatCurrency } from '@angular/common';
import { ModalMsgComponent } from '../../../core/modal-msg/modal-msg.component';
import { VentanaBusquedaPrestamos } from './ventanaBusquedaPrestamos';
import { VentanaEliminaPrestamos } from './ventanaEliminarPrestamos';
import { VentanaEstatusPrestamo } from './ventanaEstatusPrestamos';

let BusquedaID: Array<any>[] = [];

@Component({
  selector: 'app-prestamos',
  imports: [ReactiveFormsModule],
  templateUrl: './prestamos.component.html',
  styleUrl: './prestamos.component.css'
})
export class PrestamosComponent implements OnInit {

  constructor(
    public puenteData:PuenteDataService,
    private servicio:Prestamos
  ){}

    // -------Variables de referencia---
  @ViewChild('Abono') Abono!: ElementRef;
     // ---------------------------------
  // -------Variables de entorno------
  listaBusqueda: Array<any>[] = [];
  arrayHistorico: Array<any>[] = [];
  array: Array<any>[] = [];
  editar: boolean = true;
  Hoy: string = "";

  private readonly _modalMsg = inject(ModalMsgService);
  private readonly _dialog = inject(MatDialog);

    // ---------------------------------
  // -------Variables Formulario------

  formulario = signal<FormGroup>(
    new FormGroup({
      
      Id_Fondeo: new FormControl( '' ),
      id_cuentaB: new FormControl( '' ,[Validators.required] ),
      monto: new FormControl( '' ,[Validators.required] ),
      usuario: new FormControl( '' ),

    })
  )

    // ---------------------------------
  
  // -------Procedimientos de inicio------

  ngOnInit(): void {
    this.setDataLogin();
    this.cargaHistorico();
    this.cargaDataInicial();
    this.Hoy = this.fechaActual();
  }
    async cargaDataInicial(){
    this.array = await this.servicio.GetDataInicial();
  }

  async cargaHistorico() {
    this.arrayHistorico = await this.servicio.getHistorico();

  }
  setDataLogin() {
    this.puenteData.disparadorData.emit({ dato: 'Préstamos', poisionX: '' })
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

  // ---------------------------------
  // ------- Procedimientos Generales------

  ver(){
    console.log(this.formulario().value)
  }
resetForm() {

  this.formulario().patchValue({
    ['Id_Fondeo']:'',
    ['id_cuentaB']:'',
    ['monto']:'',
    ['usuario']:'',
  });

  this.editar = true
  // this.switch = true
  // this.switchbtn.nativeElement.checked = false;
}

  cargaFormulario(form: Array<any>) {
    
    form.map((item: any) => {

      this.formulario().patchValue({

        ['Id_Fondeo']:item.Id_Fondeo,
        ['id_cuentaB']:item.Id_CuentaB,
        ['monto']:item.Monto,
        
      })
    })
    
    this.Abono.nativeElement.value = this.getCurrency(form[0].Monto)

    // console.log(form[0][0].Estatus_Pagado)
    // if(form[0][0].Estatus_Pagado == '1'){
    //   this.switch = false;
    // }else{
    //   this.switch = true;
    // }
  }

  getCurrency(value: number) {
    return formatCurrency(value, 'en', '', '', '1.2-4')
    // return formatCurrency(value, 'en', '$', '', '1.2-4')
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

  // ---------------------------------
  // ------- Procedimientos de pantalla 1------
  getCurrencyAbono(event: any) {
    let value = event.target.value
    let returnvalor = value
    if (value != '') {
      returnvalor = formatCurrency(+value, 'en', '', '', '1.2-4')
      this.formulario().patchValue({ ['monto']: returnvalor.replace(/[^0-9.]/g, "") })
      event.target.value = returnvalor
      return
    }
    this.formulario().patchValue({ ['monto']: '' })
    event.target.value = returnvalor
  }

async enviar() {
    if (this.formulario().valid) {

      if( this.formulario().get('usuario')?.value ===''){
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({usuario:credenciales.Id})
      }

      let registro = await this.servicio.AgregarMovPresupuesto( this.formulario() )
      if ( registro.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
        return
      }
      
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'exito' )
      this.resetForm()
      this.cargaHistorico();
      this.listaBusqueda = [];
    }

}

async Actualizar() {

    if ( this.formulario().valid ){

      if( this.formulario().get('usuario')?.value == ''){
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({usuario:credenciales.Id})
      }

      let registroActualizado = await this.servicio.EnviarActualizacio(this.formulario(), BusquedaID)

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
      this.cargaHistorico();
      this.listaBusqueda = [];

    }
}
    // ---------------------------------
  // ------- Procedimientos de Historico------
   getCurrencyTable(value: number) {
      // return formatCurrency(value, 'en', '', '', '1.2-4')
      return formatCurrency(value, 'en', '$', '', '1.2-4')
  }

  formatoFechaLatina( fecha:string ){

    let d, m,  a , res
    if(fecha != ''){
      d = fecha.slice(8, 10)
      m = fecha.slice(5, 7)
      a = fecha.slice(0, 4)
      res = d+'-'+m+'-'+a
    }
    return res
  }

    editaroMov(id: number) {
  
      const dialogRef = this._dialog.open(VentanaBusquedaPrestamos, {
        disableClose: true,
        data: '',
        width: '450px',
  
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.servicio.cargaMovPrestamoId(id)
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

      async eliminaroMov(id: number) {
    
        const dialogRef = this._dialog.open(VentanaEliminaPrestamos, {
          disableClose: true,
          data: '',
          width: '300px'
        })
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.servicio.GetCredenciales()
              .then(credenciales => {
    
                this.servicio.eliminaPresupuesto(id, '0', credenciales.Id)
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

        async cambiarEstadoPrestamo(id: number){
      
           const dialogRef = this._dialog.open(VentanaEstatusPrestamo, {
             disableClose: true,
             data: id,
             width: '300px',
             maxWidth: '100%',
           })
       
           dialogRef.afterClosed().subscribe(result => {
            if(result){
               this.servicio.prestamoPagado( id )
               .then( respuesta => {
                
                  if (respuesta.status == 'error') {
                    this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: respuesta.data }, false, '300px', 'error')
                    return
                  }
      
                  this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: respuesta.data }, false, '300px', 'exito')
      
                  console.log(id)
                  this.cargaHistorico();
               } )
      
            }
           })
      
        }

   // ---------------------------------

}
