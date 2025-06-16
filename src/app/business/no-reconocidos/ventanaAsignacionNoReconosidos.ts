import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, ViewChild } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import { Dialog, DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
// import { Comisionistas } from "../../../core/services/comisionistas.service";
import { blob } from "stream/consumers";
import { ModalMsgService } from "../../core/services/modal-msg.service";
import { ModalMsgComponent } from "../../core/modal-msg/modal-msg.component";
import { formatCurrency } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { noReconocidos } from "../../core/services/noReconocidos.service";

@Component({
  selector: 'Ventana-Asignacion-No-Reconosidos',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatTableModule],
  template: `

      <div class="content-modalMsg">
        <div class="titulo">
          <h4>Relacionar movimiento a Cliente</h4>
          <!-- <div mat-dialog-close >
            <img src="/img-sai/icono-X-.png" alt="Cerrar">
          </div> -->
        </div>
        <div class="bodyCard">
          <div class="mensaje-modalMsg">
            <h4 class="busqueda">Búsqueda</h4>
            <h4 class="busqueda">{{noCuenta}}</h4>
            <div class="inputBusqueda">
                <p>Ingresa nombre ó número de cliente</p>
                <input class="Nombre-Cliente" #Busqueda type="text" placeholder="Nombre ó número de Cliente " (input)="inputBusqueda($event)">
            </div>
            <div class="">
                <button class="btn NuevaBusqueda mr-12" (click)="busqueda()" [disabled]="disabledBtn"
                    [classList]="disabledBtn ? 'btn NuevaBusqueda mr-12 btnActive':'btn NuevaBusqueda mr-12 btnInActivo'"
                    type="button" id="dialog-close">Nueva búsqueda
                </button>
            </div>

            <table class="table">
              <tbody>
                @for( item of listaBusqueda[0]; track $index ){
                  <tr>
                    <td class="tbody-td-ligth-No-Border NombreRazonSocial">{{item.Nombre_Razon_Social}}</td>
                    <td class="tbody-td-ligth-No-Border BRK">{{item.BRK}}</td>
                    <td class="tbody-td-ligth-No-Border TipoCliente">{{item.Tipo_Cliente}}</td>
                    <td class="tbody-td-ligth-No-Border Correo">{{item.Correo}}</td>
                    <td class="tbody-td-ligth-No-Border accion"> 
                      <div class="form-check">
                        <div class="check">
                            <label class="label-container" >
                                <input type="radio" #radioBtn1 (change)="asignar(item.Id_ICPC, item.Tipo_Cliente)" name="radio">
                                <span class="checkmark"></span>
                            </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>

            <div class="d-flex btnsRegistro">
              <div class="row ">
                <button type="submit" (click)="enviarAsignacion()" id="agrega" [disabled]="btnAsignar ? false: true"  [classList]="btnAsignar ? 'btn G-C-Registro btnInActivo':'btn G-C-Registro btnActive'" >GUARDAR REGISSTRO</button>
                <!-- <button type="submit" (click)="enviarAsignacion()" [mat-dialog-close]="true" id="agrega" [disabled]="btnAsignar ? false: true"  [classList]="btnAsignar ? 'btn G-C-Registro btnInActivo':'btn G-C-Registro btnActive'" >GUARDAR REGISSTRO</button> -->
                <button class="btn-second G-C-Registro mr-12" mat-dialog-close type="button">CANCELAR</button>
                <button [mat-dialog-close]="true" id="cerrar"></button>
              </div>
            </div>
          </div>
        </div>
       
      </div>
  `,
  styleUrl: './cdk-asignacion-style.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VentanaAsignacionNoReconosidos implements OnInit {
  constructor(
    public servicio: noReconocidos
  ){}

  displayedColumns: string[] = ['id', 'nombre', 'email']; // Define las columnas que quieres mostrar
  dataSource = new MatTableDataSource<any>(); // Define un dataSource vacío inicialmente

  
  public readonly dataModal = inject(DIALOG_DATA);
  private readonly _modalMsg = inject(ModalMsgService)
  // data = this.dataModal.data.data

  @ViewChild('Busqueda') Busqueda!: ElementRef;

  noCuenta:string = '';
  instBancaria:string = '';
  criterioBusqueda:string = '';
  disabledBtn: any = true;
  btnAsignar: any = false;
  listaBusqueda: Array<any>[] = [];
  listaAsignacion: Array<any>[] = [];


    formulario = new FormGroup({  
        Id_Mov_RN: new FormControl( ),  
        Id_ICPC: new FormControl( ),  
        Tipo_Cliente: new FormControl( ),  
        usuario: new FormControl( ),  
      })

  
  ngOnInit(): void {
    console.log( this.dataModal)
    // this.revisarCuentas()
  }

 getCurrency(value:number){
    return formatCurrency(value, 'en', '$', '','1.2-4')
  }

  inputBusqueda(event:any) {
  this.criterioBusqueda = event.target.value; 
  this.listaBusqueda = []
  this.btnAsignar=false
  if( event.target.value.length > 0 ){
    this.disabledBtn = false;
    return
  }
  this.disabledBtn = true;
}


async busqueda(){
  if( this.criterioBusqueda != '' ){
    const data = await this.servicio.busqueda( this.criterioBusqueda )
    this.disabledBtn = true;
    this.Busqueda.nativeElement.value = '';
    if( data.status === 'error' ){
      this.listaBusqueda = []
      this.criterioBusqueda = ''
      this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:data.data }, false, '300px', 'exito')
      document.getElementById('dialog-close')?.click()
          return
    }
        // console.log(data)
        this.listaBusqueda = data
        document.getElementById('dialog-close')?.click()
  }
}


asignar( Id_ICPC:number, TipoCliente:string ){
  this.btnAsignar = true;
  this.formulario.patchValue({
    ['Id_Mov_RN']:this.dataModal,
    ['Id_ICPC']:Id_ICPC,
    ['Tipo_Cliente']:TipoCliente,
  })
  console.log( this.formulario.value )
}

async enviarAsignacion(){

  // [mat-dialog-close]="true"

  if (this.formulario.get('usuario')?.value === '' || this.formulario.get('usuario')?.value == null) {
  let credenciales = await this.servicio.GetCredenciales()
  this.formulario.patchValue({ usuario: credenciales.Id })
}

let data = await this.servicio.setAsignacion( this.formulario.value )
console.log(data)
  if( data.status === 'error' ){
    this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data.data }, false, '300px', 'error')
    return
  }
  this._modalMsg.openModalMsg<ModalMsgComponent>(ModalMsgComponent, { data: data.data }, false, '300px', 'exito')
  document.getElementById('cerrar')?.click()


}
  // revisarCuentas(){
  //   if(this.dataModal[0].Banco_Tarjeta){
  //     this.noCuenta = this.formatDigito(this.dataModal[0].tarjeta, 4)
  //     this.instBancaria = this.dataModal[0].Banco_Tarjeta
  //     return
  //   }
  //   if(this.dataModal[0].Banco_cuenta){
  //     this.noCuenta = this.formatDigito(this.dataModal[0].CLABE, 3)
  //     this.instBancaria = this.dataModal[0].Banco_cuenta
  //     return
  //   }
  //   if(this.dataModal[0].FINCASH){
  //     this.noCuenta = this.formatDigito(this.dataModal[0].FINCASH, 4)
  //     this.instBancaria = 'FINCASH'
  //     return
  //   }
  // }

  // async verIdentificacion(){
  //   this.servicio.descargaComprobante( this.dataModal[0].INE )
  //   .then( (data:any)  => {
  //     if( data.status === 'error' ){
  //       this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:data.data }, false, '300px', 'exito')
  //       return
  //     }
  //     const url = URL.createObjectURL(data.data);
  //     window.open(url, '_blank');
  //   })
    
  // }
  // async verDomicilio(){
   
  //   this.servicio.descargaComprobante( this.dataModal[0].Comprobante_Domicilio )
  //   .then( (data:any) => {
  //     if( data.status === 'error' ){
  //       this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:data.data }, false, '300px', 'exito')
  //       return
  //     }
  //     const url = URL.createObjectURL(data.data);
  //     window.open(url, '_blank');
  //   } )
    
  // }
//   formatDigito( digito:string, size:number ){
//     let valorMonto = digito;
//     switch (size) {
//       case 3:
//         valorMonto = valorMonto
//         .replace(/\D/g, "")
//         .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, " ");
//       break
//       case 4:
//         valorMonto = valorMonto
//         .replace(/\D/g, "")
//         .replace(/\B(?=(\d{4})+(?!\d)\.?)/g, ` `);
//       break
//     }
//   return valorMonto  
// }
  verContrato(){
    console.log('contrato')
    // -----------------queda peidniente porque aun no se tiene el machote del cocumento ---------------------
  }
}