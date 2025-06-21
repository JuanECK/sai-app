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
        console.log('reporte')
        const response = await fetch(this._http + 'Reportes/cargaDataInicioI', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
          console.log({Inicio:data})
        if (response.status === 200) {
            return data
        }
    }
    async getHistorico() {
        const response = await fetch(this._http + 'Reportes/cargaHistoricoReportes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        console.log(data)
        if (response.status === 200) {
            return data
        }
    }

    async busquedaInversionista( number:string ) {

        const response = await fetch(this._http + 'Reportes/cargaNombreInv', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
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
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ id: Datos })
        })
        const data = await response.json()
        if (response.status === 200) {
            return data
        }
    }

    async cargaMovPrestamoId( id:number ){
        // console.log(id)
        const response = await fetch( this._http + 'Reportes/cargaMovReportes',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({id:id})
        } )
        const datos = await response.json()
        console.log(datos)
        if( response.status === 200 ){
            if( datos[0].length === 0 ){
                const data = { mensaje:'¡Por el momento no se pueden cargar los datos!' }
                return {
                    status:'error',
                    data}
            }
            return datos
        }

    }

    async prestamoPagado( id:number ) {

        const response = await fetch(this._http + 'Reportes/prestamo', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ Id_Fondeo: id })
        })
        const dataService = await response.json()
        // console.log(dataService)
        if (response.status === 200) {
            const data = { mensaje:dataService.mensaje }
            return {
                status:'',    
                data: data
            }
        }
        else {
            const data = { mensaje:dataService.error } 
            return {
                status: 'error',
                data: data 
            }
        }
    }

    async EnviarActualizacio( formularioActualizado: FormGroup, BusquedaID:Array<any> ){

            const response = await fetch(this._http + 'Reportes/actualizaMovReportes', {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
            body: JSON.stringify({formulario:formularioActualizado.value}) ,
            })
            const dataService = await response.json()
            if (response.status === 200) {
                const data = { mensaje:dataService.mensaje }
                return {
                    status:'',    
                    data: data
                }
            }
            else {
                const data = { mensaje:dataService.error } 
                return {
                    status: 'error',
                    data: data 
                }
            }
            
        }



    async eliminaPresupuesto( Id:number, estatus:string, usuario:number ){

        const response = await fetch(this._http + 'Reportes/eliminarRegistro', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify( { Id:Id, estatus:estatus, usuario:usuario } ),
        })
        const dataService = await response.json()
        // console.log(dataService)
        if (response.status === 200) {
            const data = { mensaje:dataService.mensaje }
            return {
                status:'',    
                data: data
            }
        }
        else {
            const data = { mensaje:dataService.error } 
            return {
                status: 'error',
                data: data 
            }
        }

    }

    async AgregarMovPresupuesto(formulario: FormGroup) {

        const response = await fetch(this._http + 'Reportes/agregaMovReportes', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({formulario:formulario.value}) ,
        })
        const dataService = await response.json()
        // console.log(dataService)
        if (response.status === 200) {
            const data = { mensaje:dataService.mensaje }
            return {
                status:'',    
                data: data
            }
        }
        else {
        const data = {mensaje:dataService.error} 
            return {
                status: 'error',
                data: data 
            }
        }

    }


}