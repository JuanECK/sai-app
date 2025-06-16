import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'Ventana-Busqueda-MovDivisas',
    standalone:true,
    imports: [MatDialogModule,MatButtonModule],
    styleUrl:'./cdk-dialog-style.css',
    template: `
    <div class="content-modalMsg">
      <div class="text-center">
        <h1>Edición de Registro</h1>
      </div>
      <div class="text-center mensaje-modalMsg">
        Estás intentando editar un registro. Recuerda que finalizados los
        cambios, estos afectarán los balances generales de la Plataforma 
      </div>
    </div>
    <div class="btn-group">
        <button class="buttonFull" [mat-dialog-close]="true">Continuar</button>
        <button class="buttonFull" mat-dialog-close>Cancel</button>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

export class VentanaBusquedaMovDivisas {


}