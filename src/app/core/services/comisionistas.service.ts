import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { stringify } from "querystring";

@Injectable({
    providedIn: 'root'
})

export class Comisionistas {

constructor(){}

private _http:string = `${environment.apiUrl}`;

async getEstado(){
    const response = await fetch ( this._http + 'clientes/comisionistas/estado', {
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    })
    const data = await response.json()
    if(response.status === 200){
        return data
    }
}

async getMunicipio( estado:number ) {

    const response = await fetch(this._http + 'clientes/comisionistas/municipio',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify( { estado:estado } )

    })
    const data = await response.json()
    if(response.status === 200){
        return data;
    }
}

}