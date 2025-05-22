import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class noReconocidos {

    constructor() { }

    private _http: string = `${environment.apiUrl}`;

    async getCuentas() {
        const response = await fetch(this._http + 'observaciones/cargaCuentasLista', {
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
    async getHistorico() {
        const response = await fetch(this._http + 'observaciones/cargaHistoricoObservaciones', {
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

    async setAsignacion( formulario:any ) {

        const response = await fetch(this._http + 'observaciones/asigna', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ formulario:formulario })
        })
        const datos = await response.json()
        if( response.status === 200 ){
            const data = { mensaje:datos.mensaje }
            if( datos.status === 'error' ){
            return {
                status:'error',
                data:data
            }
            }
            return {
                status:'ok',
                data:data
            }
        }else{
            const data = { mensaje:datos.error }
            return {
                status:'error',
                data:data
            }
        }
    }


    async cargaObservacionesId( id:number ){
        console.log(id)
        const response = await fetch( this._http + 'observaciones/cargaObservaciones',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({id:id})
        } )
        const datos = await response.json()
        // console.log(datos)
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

    async busqueda( criterio:string ){

        const response = await fetch( this._http + 'observaciones/busqueda',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({criterio:criterio})
        } )
        const datos = await response.json()
        console.log(datos)
        if( response.status === 200 ){
            if( datos.status === 'error' ){
                const data = { mensaje:datos.mensaje }
            return {
                status:'error',
                data:data
            }
            }
            return datos;
        }else{
            const data = { mensaje:datos.error }
            return {
                status:'error',
                data:data
            }
        }

    }


    async EnviarActualizacio( formularioActualizado: FormGroup, BusquedaID:Array<any> ){

        let hayCambios:boolean = this.hayCambiosEnForm( formularioActualizado, BusquedaID )


        if( hayCambios ){
            
            console.log('cambios')

            const response = await fetch(this._http + 'observaciones/actualizaObservacion', {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({formulario:formularioActualizado.value}) ,
                // redirect: "follow"
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
        
        const data = { mensaje:'No se detectaron modificaciones' } 
        return {
            status: 'edicion',
            data: data 
        }

    }


    hayCambiosEnForm( form:FormGroup, BusquedaID:Array<any> ){
        console.log(BusquedaID)

        for( let i = 0; i< Object.keys(form.value).length ; i++){
            let valor1 = Object.keys(form.value)[i]
            for( let j = 0; j < Object.keys(BusquedaID[0]).length ; j++){
                let valor2 = Object.keys(BusquedaID[0])[j]
                let val1A = Object.values(form.value)[i] == null ? '': Object.values(form.value)[i]
                if(valor1 === valor2){
                    if( val1A != Object.values(BusquedaID[0])[j] ){
                        return true
                    }
                }
            }
        }

        return false
    }


    async eliminaObservacion( Id:number, estatus:string, usuario:number ){

        const response = await fetch(this._http + 'observaciones/eliminarRegistro', {
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

    async AgregarCuenta(formulario: FormGroup) {

        const response = await fetch(this._http + 'observaciones/agregaObservacion', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({formulario:formulario}) ,
            // redirect: "follow"
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