
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";

@Injectable({
    providedIn: 'root'
})


export class HeadService {

    constructor(){}
    private _http:string = `${environment.apiUrl}`


    async getModulos ( id:string ) {

    const response = await fetch( this._http + "auth/modulo", {
        method: 'POST',
        credentials: 'include',
        headers: {
             'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        }) 
    } )   
    const data = response.json()
    if(response.status === 200){
        return data
    }        

}

async getModulosHijo ( id:string, idHijo:string ) {

}



}