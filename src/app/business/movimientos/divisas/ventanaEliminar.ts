import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'Ventana-Elimina-MovDivisas',
    standalone:true,
    imports: [MatDialogModule,MatButtonModule],
    styleUrl:'./cdk-dialog-style.css',
    template: `
    <div class="content-modalMsg">
      <div class="text-center">
        <h1>Eliminar Registro</h1>
      </div>
      <div class="text-center mensaje-modalMsg">
      Esta acción eliminará permanentemente la
      información asociada a este
      </div>
    </div>
    <div class="btn-group">
        <button class="buttonFull" [mat-dialog-close]="true">Continuar</button>
        <button class="buttonFull" mat-dialog-close>Cancel</button>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

export class VentanaEliminaMovDivisas {


}