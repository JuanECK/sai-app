import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class Reportes {

    constructor() { }

    private _http: string = `${environment.apiUrl}`;

    async GetDataInicial() {

        const response = await fetch(this._http + 'Reportes/cargaDataInicioI', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        // console.log({ Inicio: data })
        if (response.status === 200) {
            return data
        }
    }
    async GetDataInicialG() {

        const response = await fetch(this._http + 'Reportes/cargaDataInicioG', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        // console.log({ Inicio: data })
        if (response.status === 200) {
            return data
        }
    }

    async busquedaInversionista(number: string) {

        const response = await fetch(this._http + 'Reportes/cargaNombreInv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ criterio: number })
        })
        const data = await response.json()
        if (response.status === 200) {
            return data
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

    async ReporteIndividual(formulario: FormGroup) {

        const response = await fetch(this._http + 'Reportes/ReporteIndividual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ formulario: formulario.value }),
        })
        const dataService = await response.json()
        console.log({ ReporteI: dataService })
        if (response.status === 200) {
            // const data = { mensaje:dataService.mensaje }
            return {
                status: '',
                data: dataService
            }
        }
        else {
            const data = { mensaje: dataService.error }
            return {
                status: 'error',
                data: data
            }
        }

    }
    async ReporteGlobal(formulario: FormGroup) {

        const response = await fetch(this._http + 'Reportes/ReporteGlobal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ formulario: formulario.value }),
        })
        const dataService = await response.json()
        console.log({ ReporteG: dataService })
        if (response.status === 200) {
            // const data = { mensaje:dataService.mensaje }
            return {
                status: '',
                data: dataService
            }
        }
        else {
            const data = { mensaje: dataService.error }
            return {
                status: 'error',
                data: data
            }
        }

    }
    async ReporteGlobalCatalogo(formulario: FormGroup) {

        const response = await fetch(this._http + 'Reportes/ReporteGlobalCatalogo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ formulario: formulario.value }),
        })
        const dataService = await response.json()
        // console.log({ Reporte: dataService })
        if (response.status === 200) {
            // const data = { mensaje:dataService.mensaje }
            return {
                status: '',
                data: dataService
            }
        }
        else {
            const data = { mensaje: dataService.error }
            return {
                status: 'error',
                data: data
            }
        }

    }


}