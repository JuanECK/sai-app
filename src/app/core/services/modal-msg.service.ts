import { ComponentType } from "@angular/cdk/portal";
import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

// interface SizeModal { width: '600px', height: '400px' }
@Injectable({providedIn: 'root'})
export class ModalMsgService {
    constructor() {}

    private readonly _dialog = inject(MatDialog);


    openModalMsg<CT>( componentRef: ComponentType<CT>, data?:any, width?:string, height?:string ):void{
    // openModalMsg<CT, T>( componentRef: ComponentType<CT>, data?: T, isEditing = false ):void{

        const config = { data }

        this._dialog.open( componentRef, {
            panelClass:"custom",
            data: config,
            width: width,
            // height: height,
        } )

    }

    closeModalMsg():void{
        this._dialog.closeAll();
    }
}