import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class Presupuesto {

    constructor() { }

    private _http: string = `${environment.apiUrl}`;

    async GetDataInicial() {
        const response = await fetch(this._http + 'movimientos/Presupuesto/cargaDataInicio', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        //   console.log(data)
        if (response.status === 200) {
            return data
        }
    }
    async getHistorico() {
        const response = await fetch(this._http + 'movimientos/Presupuesto/cargaHistoricoPresupuesto', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        // console.log(data)
        if (response.status === 200) {
            return data
        }
    }

    async getPresupuestoMensual() {
        const response = await fetch(this._http + 'movimientos/Presupuesto/cargaPresupuestoMensual', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        // console.log(data)
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

    async cargaMovPresupuestoId( id:number ){
        // console.log(id)
        const response = await fetch( this._http + 'movimientos/Presupuesto/cargaMovPresupuesto',{
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


    async InsertaPresupuestoMensual( presupuesto: FormGroup ){

        const response = await fetch(this._http + 'movimientos/Presupuesto/InsertaPresupuestoMensual', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
        body: JSON.stringify({presupuesto:presupuesto.value}) ,
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

    async ActualizacioPresupuestoMensual( formularioActualizado: FormGroup ){

            const response = await fetch(this._http + 'movimientos/Presupuesto/actualizaAbonoPresupuesto', {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
            body: JSON.stringify({abono:formularioActualizado.value}) ,
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

        const response = await fetch(this._http + 'movimientos/Presupuesto/eliminarRegistro', {
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

    async abonoPresupuestoMensual(formulario: FormGroup) {

        const response = await fetch(this._http + 'movimientos/Presupuesto/agregaAbonoPresupuesto', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({abono:formulario.value}) ,
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
    async modificacionPresupuestoMensual(formulario: FormGroup) {

        const response = await fetch(this._http + 'movimientos/Presupuesto/modificacionPresupuestoMensual', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({modificacion:formulario.value}) ,
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