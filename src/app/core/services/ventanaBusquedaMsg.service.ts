import { ComponentType } from "@angular/cdk/portal";
import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Injectable({providedIn: 'root'})

export class VentanaBusquedaMsgService {
    constructor() {}

    private readonly _dialog = inject(MatDialog);
    retorno:boolean = false


    // openDialog<CT>( componentRef: ComponentType<CT>, data?:any, closeModal?:boolean, width?:string):Promise<boolean> | boolean {


        // const config = { data, closeModal }

        // const dialogRef = this._dialog.open(componentRef,{
        //     disableClose:closeModal,
        //     data: config,
        //     width: width,
        // });
    
        // dialogRef.afterClosed().subscribe(result => {
        //   console.log(`Dialog result: ${result}`);
        //   this.retorno = true
        // });
        
        // return this.retorno

    // }

    // closeModalMsg():void{
    //     this._dialog.closeAll();
    // }
}