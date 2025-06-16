import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'Ventana-Busqueda-MovOficina',
    standalone:true,
    imports: [MatDialogModule,MatButtonModule],
    styleUrl:'./cdk-dialog-style.css',
    template: `
    <div class="content-modalMsg">
      <div class="text-center">
        <h1>Edición de Registro</h1>
      </div>
      <div class="text-center mensaje-modalMsg">
        Estas solicitando editar la información
        de un registro de oficina 
      </div>
    </div>
    <div class="btn-group">
        <button class="buttonFull" [mat-dialog-close]="true">Continuar</button>
        <button class="buttonFull" mat-dialog-close>Cancel</button>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

export class VentanaBusquedaMovOficina {


}