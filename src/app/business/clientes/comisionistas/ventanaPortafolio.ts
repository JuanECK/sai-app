import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, QueryList, signal, ViewChildren } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import { DIALOG_DATA, } from '@angular/cdk/dialog';
import { Comisionistas } from "../../../core/services/comisionistas.service";
import { ModalMsgService } from "../../../core/services/modal-msg.service";
import { ModalMsgComponent } from "../../../core/modal-msg/modal-msg.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

let cuenta = 1;
let porciento = 0;
let porcentaje = [0, 0, 0, 0, 0]

@Component({
  selector: 'Ventana-Ver-Informacion-Msg',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  template: `

      <div class="content-port-inv">

        <div class=" titulo text-center">
          <h1>Crear Portafolios de Inversión</h1>
        </div>
                <!-- <button (click)="ver()">ver</button> -->
        <div class="bodyCard-inv">
          <!-- <div class="modal-port-inv"> -->
            <form class="form-comisionista-inversion " [formGroup]="formulario()">
                <div class="d-flex grupo-campos">
                  <div>
                      <h4><span [classList]="formulario().get('BRK')?.valid ? 'Obligatiro-is-valid':'Obligatiro-is-invalid'" >*</span> No. de BRK</h4>
                      <div class="inputBRK">
                          <span>BRK-</span>
                          <input class="input1" type="text" maxlength="4"  placeholder="" (change)="insertaNumBRK( $event )" (input)="soloDigito( $event )">
                      </div>
                  </div>
                  <div>
                      <!-- <h4>Fecha de nacimiento</h4> -->
                      <h4><span [classList]="formulario().get('Fecha_Nac')?.valid ? 'Obligatiro-is-valid':'Obligatiro-is-invalid'">*</span> Fecha de nacimiento</h4>
                      <input  class="custom-date-picker FechaNacimientoBRK mr-12- " #piker type="date" max="hoy" formControlName="Fecha_Nac" (change)="validaFecha( $event, 'Fecha_Nac' )" >
                  </div>
                </div>

                <div class="d-flex grupo-campos">
                  <div class="">
                      <h4 class="InvRefInt"><span [classList]="formulario().get('Recomendado')?.valid ? 'Obligatiro-is-valid':'Obligatiro-is-invalid'">*</span> Referencia interna</h4>
                      <!-- <input type="text" class="input1" formControlName="Recomendado" placeholder="Elige del catálogo de comisionistas" > -->
                      <div class="select selectRefInt">
                          <span class="spanExedioCaractereSelect" id="estado" [ariaSelected]="true" [hidden]="selectReferido">...</span>
                          <select required #comisionistaReferido class="" formControlName="Recomendado">
                              <option value="" disabled selected hidden>Nombre de la referecia interna</option>
  
                              @for(item of dataModal.ReferidoBRK[0]; track $index ){
                                  <option [value]="item.Nombre_Razon_Social">{{item.Nombre_Razon_Social}}</option>                                    
                              }
  
                          </select>
                      </div>
                  </div>
                  <div class="FechaEmisionContratoDiv">
                      <h4>Fecha de emisión de Contrato</h4>
                      <input  class="custom-date-picker FechaEmisionContrato mr-12- " #piker type="date"  formControlName="Fecha_Contrato">
                  </div>
                </div>

              <!-- <div class="d-flex grupo-campos">
                  <div>
                      <h4>Cuenta o tarjeta asociada</h4>
                      <div>

                        <div class="select CuentaTargeta">
                          <select required>
                          <option value="" disabled selected hidden>Selecciona el tipo de cuenta</option>
                          <option value="1">Cuenta CLABE</option>
                          <option value="2">Targeta Debito</option>
                          <option value="3">Targeta Fincash</option>
                          </select>
                        </div>

                      </div>
                  </div>
                  <div class="NoCuentaTargeta">
                      <h4>No. de cuenta o tarjeta</h4>
                      <input type="text" class="input2" placeholder="Institución Financiera relacionada" >
                  </div>
              </div>
              
              <div class="d-flex grupo-campos">
                  <div>
                      <h4>Institución Bancaria</h4>
                      <div>
                          <input class="input1" type="text" placeholder="Nombre del Banco emisor">
                      </div>
                  </div>

              </div> -->

              <div class="grupo-beneficiario" id="beneficiario">

                <div class="d-flex mt-15 ">
                  <div>
                    <h4><span [classList]="formulario().get('Beneficiario1')?.valid ? 'Obligatiro-is-valid':'Obligatiro-is-invalid'" >*</span> Beneficiario 1</h4>
                    <div>
                        <input class="input1" type="text" formControlName="Beneficiario1" placeholder="Nombre completo">
                    </div>
                  </div>
                    <div>
                      <h4><span [classList]="formulario().get('Fecha_Nac_Beneficiario1')?.valid ? 'Obligatiro-is-valid':'Obligatiro-is-invalid'" >*</span> Fecha de nacimiento</h4>
                      <input  class="custom-date-picker FechaNacimientoBeneficiario mr-12 group2" type="date" max="hoy" formControlName="Fecha_Nac_Beneficiario1" (change)="validaFecha( $event, 'Fecha_Nac_Beneficiario1' )">
                    </div>
                    <div>
                      <div class="porciento">
                        <span class="iconoPorc" >%</span>
                        <input class="porcentaje porcienObligatorio group2" type="text" formControlName="Porcentaje_Beneficiario1" (change)="evaluaPorciento( $event, 0 )" (input)="soloDigito($event)" placeholder="">
                      </div>
                  </div>
                </div>

                <div [classList]=" Benef2 ? '' :'d-flex mt-15' ">
                  <div>
                    <h4 [hidden]="Benef2" ><span [classList]="formulario().get('Beneficiario2')?.valid ? 'Obligatiro-is-valid':'Obligatiro-is-invalid'" >*</span> Beneficiario 2</h4>
                    <div>
                        <input [hidden]="Benef2" class="input1"  type="text" formControlName="Beneficiario2" placeholder="Nombre completo">
                    </div>
                  </div>
                    <div>
                    <h4 [hidden]="Benef2">Fecha de nacimiento</h4>
                      <input [hidden]="Benef2" class="custom-date-picker FechaNacimientoBeneficiario mr-12 group2" type="date" max="hoy" formControlName="Fecha_Nac_Beneficiario2" (change)="validaFecha( $event, 'Fecha_Nac_Beneficiario2' )">
                    </div>
                    <div class="porciento">
                      <span class="iconoPorc" [hidden]="Benef2">%</span>
                      <input [hidden]="Benef2" class="porcentaje group2" type="number" formControlName="Porcentaje_Beneficiario2" (change)="evaluaPorciento( $event, 1 )" (input)="soloDigito($event)" placeholder="">
                  </div>
                </div>

                <div [classList]=" Benef3 ? '' :'d-flex mt-15' ">
                  <div>
                    <h4 [hidden]="Benef3" ><span [classList]="formulario().get('Beneficiario3')?.valid ? 'Obligatiro-is-valid':'Obligatiro-is-invalid'" >*</span> Beneficiario 3</h4>
                    <div>
                        <input [hidden]="Benef3" class="input1"  type="text" formControlName="Beneficiario3" placeholder="Nombre completo">
                    </div>
                  </div>
                  <div>
                    <h4 [hidden]="Benef3">Fecha de nacimiento</h4>
                    <input [hidden]="Benef3" class="custom-date-picker FechaNacimientoBeneficiario mr-12 group2" type="date" max="hoy" formControlName="Fecha_Nac_Beneficiario3" (change)="validaFecha( $event, 'Fecha_Nac_Beneficiario3' )">
                  </div>
                  <div class="porciento">
                    <span class="iconoPorc" [hidden]="Benef3">%</span>
                    <input [hidden]="Benef3" class="porcentaje group2" type="number" formControlName="Porcentaje_Beneficiario3" (change)="evaluaPorciento( $event, 2 )" (input)="soloDigito($event)" placeholder="">
                  </div>
                </div>

                <div [classList]=" Benef4 ? '' :'d-flex mt-15' ">
                  <div>
                    <h4 [hidden]="Benef4" ><span [classList]="formulario().get('Beneficiario4')?.valid ? 'Obligatiro-is-valid':'Obligatiro-is-invalid'" >*</span> Beneficiario 4</h4>
                    <div>
                        <input [hidden]="Benef4" class="input1"  type="text" formControlName="Beneficiario4" placeholder="Nombre completo">
                    </div>
                  </div>
                    <div>
                    <h4 [hidden]="Benef4">Fecha de nacimiento</h4>
                      <input [hidden]="Benef4" class="custom-date-picker FechaNacimientoBeneficiario mr-12 group2" type="date" max="hoy" formControlName="Fecha_Nac_Beneficiario4" (change)="validaFecha( $event, 'Fecha_Nac_Beneficiario4' )">
                    </div>
                    <div class="porciento">
                        <span class="iconoPorc" [hidden]="Benef4">%</span>
                        <input [hidden]="Benef4" class="porcentaje group2" type="number" formControlName="Porcentaje_Beneficiario4" (change)="evaluaPorciento( $event, 3 )" (input)="soloDigito($event)" placeholder="">
                    </div>
                </div>

                <div [classList]=" Benef5 ? '' :'d-flex mt-15' ">
                  <div>
                    <h4 [hidden]="Benef5" ><span [classList]="formulario().get('Beneficiario5')?.valid ? 'Obligatiro-is-valid':'Obligatiro-is-invalid'" >*</span> Beneficiario 5</h4>
                    <div>
                        <input [hidden]="Benef5" class="input1"  type="text" formControlName="Beneficiario5" placeholder="Nombre completo">
                    </div>
                  </div>
                    <div>
                    <h4 [hidden]="Benef5">Fecha de nacimiento</h4>
                      <input [hidden]="Benef5" class="custom-date-picker FechaNacimientoBeneficiario mr-12 group2" type="date" max="hoy" formControlName="Fecha_Nac_Beneficiario5" (change)="validaFecha( $event, 'Fecha_Nac_Beneficiario5' )">
                    </div>
                    <div class="porciento">
                        <span class="iconoPorc" [hidden]="Benef5">%</span>
                        <input [hidden]="Benef5" class="porcentaje group2" type="number" formControlName="Porcentaje_Beneficiario5" (change)="evaluaPorciento( $event, 4 )" (input)="soloDigito($event)" placeholder="">
                    </div>
                </div>


                <!-- <button (click)="quitaBeneficiario()">Elimina beneficiario</button> -->
                
              </div>
              <div class="d-flex">
                <button class="btn btnAgregaBeneFiciario" (click)="agregaBeneficiario()">Agregar beneficiario</button>
                <button class="btn-second EliminaBeneFiciario" (click)="eliminaBeneficiario()">Elimina beneficiario</button>
              </div>
              
              <div class="row btnAccionPortafolio">
                <button type="submit" (click)="creaPortafolioInversion()" [classList]="formulario().valid ? 'btn btnInActivo ':'btn btnActive'" [mat-dialog-close]="true">GUARDAR REGISSTRO</button>
                <!-- <button type="submit" (click)="ver()" [classList]="formulario().valid ? 'btn G-C-Registro btnInActivo':'btn G-C-Registro btnActive'" >GUARDAR REGISSTRO</button> -->
                <button class="btn-second cancelPortafolio" id="dialog-close" type="button" (click)="Cerrar()" mat-dialog-close >CANCELAR</button>
              </div>
            </form>
          

          <!-- </div> -->
        </div>

      </div>
  `,
  styleUrl: 'cdk-Portafolio-style.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VentanaCreaPortafolio implements OnInit{
  constructor(
    public servicio: Comisionistas
    
  ) { }
  
  
  public readonly dataModal = inject(DIALOG_DATA);
  private readonly _modalMsg = inject(ModalMsgService)

  @ViewChildren("piker") piker!: ElementRef;
  
  selectReferido: boolean = true;
  Benef2: boolean = true;
  Benef3: boolean = true;
  Benef4: boolean = true;
  Benef5: boolean = true;
  hoy_fecha = new Date().toISOString().substring(0, 10);
  
  ob1: any = []
  
  formulario = signal<FormGroup>(
    new FormGroup({
      usuario: new FormControl(''),
      Id_ICPC: new FormControl('', [Validators.required]),
      BRK: new FormControl('', [Validators.required]),
      Fecha_Nac: new FormControl('', [Validators.required, Validators.min(18)]),
      
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
      
      // Banco_cuenta: new FormControl(''),
      // CLABE: new FormControl(''),
      // FINCASH: new FormControl(''),
      // Banco_Tarjeta: new FormControl(''),
      // Tarjeta: new FormControl(''),
      
      Recomendado: new FormControl('', [Validators.required]),
      Fecha_Contrato: new FormControl(''),
      estatus: new FormControl('1'),
      
    })
  )

  insertaNumBRK( event:any ){
    if( event.target.value === '' ){
      this.formulario().patchValue({['BRK']:''})
      return
    }
    this.formulario().patchValue({['BRK']:'BRK-'+event.target.value})
  }
  
  ngOnInit(): void {
    console.log(this.dataModal)
    this.formulario().patchValue({Id_ICPC:this.dataModal.Id_ICPC})

    document.querySelectorAll("input[type='date'][max='hoy']")
    .forEach((elemento:any) => {
        elemento.max = this.hoy_fecha;
        elemento
    });
  }

  Cerrar(){
    cuenta = 1;
    porcentaje = [0, 0, 0, 0, 0]
  }
  
  soloDigito(event:any){
    let valorMonto = event.target.value;
    valorMonto = valorMonto
    .replace(/\D/g, "")
    event.target.value = valorMonto  
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

  evaluaPorciento(event:any, id: number) {
    
    let val = event != '' ? +event.target.value : 0
    porcentaje[id] = 0
    let cuenta = porcentaje[0] + porcentaje[1] + porcentaje[2] + porcentaje[3] + porcentaje[4]
    cuenta = cuenta + val;

    if (cuenta > 100) {

      console.log('exedido')
      console.log(porcentaje, ' cuenta' + cuenta)
      return event.target.value = ''
      
    }

    porcentaje[id] = val
    console.log(porcentaje, ' cuenta' + cuenta)

    return
  }


  agregaBeneficiario() {

    switch (cuenta) {
      case 1:
        // this.formulario().get( 'Beneficiario2' )?.addValidators( Validators.required )

        this.Benef2 = false;
        cuenta += 1
        break

      case 2:
        this.Benef3 = false;
        cuenta += 1
        break

      case 3:
        this.Benef4 = false;
        cuenta += 1
        break

      case 4:
        this.Benef5 = false;
        cuenta += 1
        break

    }

  }

  eliminaBeneficiario() {
    switch (cuenta) {
      case 2:
        // this.formulario().get( 'Beneficiario2' )?.clearValidators()
        this.Benef2 = true;
        this.evaluaPorciento('', 1)
        this.formulario().patchValue({
          Beneficiario2: '',
          Fecha_Nac_Beneficiario2: '',
          Porcentaje_Beneficiario2: ''
        })
        cuenta -= 1
        break

      case 3:
        this.Benef3 = true;
        this.evaluaPorciento('', 2)
        this.formulario().patchValue({
          Beneficiario3: '',
          Fecha_Nac_Beneficiario3: '',
          Porcentaje_Beneficiario3: ''
        })
        cuenta -= 1
        break

      case 4:
        this.Benef4 = true;
        this.evaluaPorciento('', 3)
        this.formulario().patchValue({
          Beneficiario4: '',
          Fecha_Nac_Beneficiario4: '',
          Porcentaje_Beneficiario4: ''
        })
        cuenta -= 1
        break

      case 5:
        this.Benef5 = true;
        this.evaluaPorciento('', 4)
        this.formulario().patchValue({
          Beneficiario5: '',
          Fecha_Nac_Beneficiario5: '',
          Porcentaje_Beneficiario5: ''
        })
        cuenta -= 1
        break

    }

  }

  async creaPortafolioInversion(){

    
    if( this.formulario().valid ){
      
      if( this.formulario().get('usuario')?.value ==='' || this.formulario().get('usuario')?.value == null){
        let credenciales = await this.servicio.GetCredenciales()
        this.formulario().patchValue({usuario:credenciales.Id})
      }
      
      let registro = await this.servicio.RegistraInversionista( this.formulario().value )
      if ( registro.status === 'error' ){
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'error' )
        return
      }
      
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:registro.data }, false, '300px', 'exito' )
      // document.getElementById('dialog-close')?.click()
      
    }
    // console.log(this.formulario().value)
    
  }

  ver(){console.log(this.formulario().value)}
}

