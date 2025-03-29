import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class Comisionistas {

    constructor() { }

    private _http: string = `${environment.apiUrl}`;

    async getEstado() {
        const response = await fetch(this._http + 'clientes/comisionistas/estado', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if (response.status === 200) {
            return data
        }
    }

    async getMunicipio(estado: number) {

        const response = await fetch(this._http + 'clientes/comisionistas/municipio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: estado })

        })
        const data = await response.json()
        if (response.status === 200) {
            return data;
        }
    }

    async getComprobante(fileInput: any) {
        let aplication = new FormData();

        aplication.append('file', fileInput)
        // console.log(fileInput)
        const response = await fetch(this._http + 'upload/single/comisionistas', {
            method: 'POST',
            body: aplication,
            redirect: "follow"
        })
        const data = await response.json();
        if (response.status === 200) {
            return data
        }
        else {
            return {
                status: 'error',
                data: data
            }
        }
    }

    async GetCredenciales() {

        const sesion = localStorage.getItem('sesion');
        const { Datos } = JSON.parse(sesion!)

        const response = await fetch(this._http + 'auth/credenciales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: Datos })
        })
        const data = await response.json()
        if (response.status === 200) {
            return data
        }
    }

    async AgregarComisionista(formulario: FormGroup) {

        // console.log(formulario.value.INE)
        // console.log(JSON.stringify(formulario))

        let aplication = new FormData();
        aplication.append('file', formulario.value.INE)
        , formulario.value.Comprobante_domicilio
        // aplication.append('file', JSON.stringify(formulario))


        for (const [key, value] of Object.entries(formulario.value)) {
            if (typeof value != "object") {
                aplication.append(key, String(value))
            }else{
                aplication.append(key, '')
            }
        }


        const response = await fetch(this._http + 'clientes/comisionistas/agregaComisionista/comisionistas', {
        // const response = await fetch(this._http + 'clientes/comisionistasAgrega/agregaComisionista/comisionistas', {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(formulario),
            body: aplication,
            redirect: "follow"
        })
        const data = await response.json()
        console.log(data)
        if (response.status === 200) {
            return data
        }
        else {
            return {
                status: 'error',
                data: data
            }
        }
    }

}