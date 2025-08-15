import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import { Dialog, DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
// import { Comisionistas } from "../../../core/services/comisionistas.service";
import { blob } from "stream/consumers";
import { ModalMsgService } from "../../../core/services/modal-msg.service";
import { ModalMsgComponent } from "../../../core/modal-msg/modal-msg.component";
import { Inversionistas } from "../../../core/services/inversionistas.service";
import { formatCurrency } from "@angular/common";
import { movInvercion } from "../../../core/services/movInvercion.service";
import { Proveedor } from "../../../core/services/movProveedor.service";
import { Facturas } from "../../../core/services/movFacturas.service";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: 'Ventana-FinalizarMovimiento',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  template: `

    <form [formGroup]="formulario()">
      <div class="content-modalMsg">
        <div class="titulo">
          <h2 class="">Finalizar movimiento</h2>
          <p class="">Fecha del registro: <span>{{formatoFechaLatina(dataModal.datos[0][0].Fecha_Captura)}}</span></p>
        </div>
        <div class="bodyCard">
          <div class="sec-A">
            <h4>Estatus</h4>
            <h4>Esquema</h4>
            <!-- <h4>Cuenta de retorno</h4> -->
            <h4>Financiamiento</h4>
            <h4>Pago de factura</h4>
            <h4>Pago a comisionista</h4>
            <h4>Comisión Obtenida</h4>
          </div>
          <div class="sec-B"> 

            <div class="d-flex checkPago">
              <label  class="form-check-label-left" >Pagado</label>
              <div class="check">
                <label class="label-container-left" >
                  <input type="checkbox" #radioBtn1 (change)="evaluaPago( $event )" formControlName="estatus_pagado" name="radio">
                  <span class="checkmark-left"></span>
                </label>
              </div>
            </div>

           <div class="Esquema">
            <h4>{{dataModal.datos[0][0].Esquema}}</h4>
              <!--  <div class="select Esquema">
                  <select required class="" formControlName="Id_CuentaB" >
                      <option value="" disabled selected hidden>Cuenta de comisiones fac</option>
                      @for(item of dataModal.facturacion; track $index ){
                          <option [value]="item.Id_CuentaB">{{item.Alias_Cuenta}}</option>
                      }
                  </select>
              </div>-->
            </div> 

            <h4 class="financiamiento">{{getCurrency(dataModal.datos[0][0].Financiamiento)}}</h4>
            <h4>{{getCurrency(dataModal.datos[0][0].Factura)}}</h4>
            <h4>{{getCurrency(dataModal.datos[0][0].Comisionista)}}</h4>
            <h4>{{getCurrency(dataModal.datos[0][0].Propia)}}</h4>
          </div>
          
          <div class="text-center mensaje-modalMsg">
            
            </div>
            
          </div>
          <div class="d-flex btnsRegistro">
              <div class="row ">
                  <button type="submit" (click)="FinalizarMovimiento()" [classList]="this.formulario().valid ? 'btn G-C-Registro btnInActivo':'btn G-C-Registro btnActive'" >GUARDAR</button>
                  <!-- <button type="submit" (click)="FinalizarMovimiento()" [classList]="enviar ? 'btn G-C-Registro btnInActivo':'btn G-C-Registro btnActive'" >GUARDAR</button> -->
                  <button class="btn-second G-C-Registro mr-12" type="button" mat-dialog-close >CANCELAR</button>
                  <button [mat-dialog-close]="true" id="cerrar"></button>
              </div>
          </div>
      </div>
    </form>
  `,
  styleUrl: './cdk-ventana-style.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VentanaFinalizarMovimiento implements OnInit {
  constructor(
    public servicio: Facturas
  ) { }

    formulario = signal<FormGroup>(
      new FormGroup({

        Id_Mov_Fact: new FormControl( '' ),
        estatus_pagado: new FormControl( '',[Validators.required] ),
        // Id_CuentaB: new FormControl( '' ,[Validators.required] ),
        usuario: new FormControl( '' ),
      })
    )

  public readonly dataModal = inject(DIALOG_DATA);
  private readonly _modalMsg = inject(ModalMsgService)

  direccion: string = '';
  array: Array<any>[] = [];
  enviar: boolean = false;

  ngOnInit(): void {
    console.log(this.dataModal)

  }
  formatoFechaLatina( fecha:string ){
    // let fecha = '2025-02-26'
    // console.log(fecha)
    let mesNumero;
    var getMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    let d, m,  a , res
    d = fecha.slice(8, 10)
    m = fecha.slice(5, 7)
    a = fecha.slice(0, 4)
    if(m.slice(0,1) === '0'){
      mesNumero = m.slice(1,2)
    }else{
      mesNumero = m;
    }

    res = d+' / '+ getMes[+mesNumero-1] +' / '+a
    return res
  }
  getCurrency(value: number) {
    return formatCurrency(value, 'en', '$', '', '1.2-4')
  }

  formatDigito(digito: string, size: number) {
    let valorMonto = digito;
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
    return valorMonto
  }

  evaluaPago( event:any ){
    if(event.target.checked){
      this.formulario().patchValue({['estatus_pagado']:'1'})
      this.enviar = true;
      return
    }
    this.enviar = false;
    this.formulario().patchValue({['estatus_pagado']:''})
  }

  async FinalizarMovimiento(){

    if( this.formulario().get('usuario')?.value ==''){
      let credenciales = await this.servicio.GetCredenciales()
      this.formulario().patchValue({usuario:credenciales.Id})
    }

    if(this.formulario().valid){
      this.formulario().patchValue({['Id_Mov_Fact']:this.dataModal.datos[0][0].Id_Mov_Fact})

      let dato = await this.servicio.cambiaEstatusPagado( this.formulario() )
      if ( dato.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:dato.data }, false, '300px', 'error' )
        return
      }
      
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:dato.data }, false, '300px', 'exito' )
      document.getElementById('cerrar')?.click()
    }
    console.log(this.formulario().value)
  }

}