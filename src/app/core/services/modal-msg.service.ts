import { ComponentType } from "@angular/cdk/portal";
import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

// interface SizeModal { width: '600px', height: '400px' }
@Injectable({providedIn: 'root'})
export class ModalMsgService {
    constructor() {}

    private readonly _dialog = inject(MatDialog);


    openModalMsg<CT>( componentRef: ComponentType<CT>, data?:any, closeModal?:boolean, width?:string, TypeMsg?:string ):void{

        const config = { data, closeModal, TypeMsg}

        const dialogRef = this._dialog.open( componentRef, {
            panelClass:"custom",
            disableClose:closeModal,
            data: config,
            width: width,
        } )

        dialogRef.afterClosed().subscribe(result => {
            // console.log(`Dialog result: ${result}`);
            return result
          });

    }

    closeModalMsg():void{
        this._dialog.closeAll();
    }
}