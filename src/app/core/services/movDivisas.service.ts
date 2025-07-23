import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class Divisas {

    constructor() { }

    private _http: string = `${environment.apiUrl}`;

    async GetDataInicial() {
        const response = await fetch(this._http + 'movimientos/Divisas/cargaDataInicio', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
          console.log({inicio:data})
        if (response.status === 200) {
            return data
        }
    }
    async getHistorico() {
        const response = await fetch(this._http + 'movimientos/Divisas/cargaHistoricoDivisas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        // console.log({HistoricoDiv:data})
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

    async GetConcepto( icpc:number ) {

        const response = await fetch(this._http + 'movimientos/Divisas/cargaConcepto', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ icpc: icpc })
        })
        const data = await response.json()
        if (response.status === 200) {
            return data
        }
    }

    async GetSaldoYued( id:number ) {

        const response = await fetch(this._http + 'movimientos/Divisas/cargaSaldoYued', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        const data = await response.json()
        if (response.status === 200) {
            return data
        }
    }

    async descargaComprobante( nameComprobante:string ){

        const response = await fetch( this._http + 'download/movDivisas/'+nameComprobante,{
            method:'GET',
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            redirect: "follow"
        } )

        if( response.status === 200){
            const datos = await response.blob()
            return {
                status:'ok',
                data:datos
            }
        }else{
            const datos = await response.json();
            const data = { mensaje:datos.error }
            return{
                status:'error',
                data:data
            }
        }
    }

    async cargaMovDivisasId( id:number ){
        // console.log(id)
        const response = await fetch( this._http + 'movimientos/Divisas/cargaMovDivisas',{
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

        const response = await fetch( this._http + 'movimientos/Divisas/busqueda',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({criterio:criterio})
        } )
        const datos = await response.json()
        // console.log(datos)
        const { data, status } = datos
        if( response.status === 200 ){
            if( datos.status === 'error' ){
                const data = { mensaje:datos.mensaje }
            return {
                status:'error',
                data:data
            }
            }
            return data;
        }else{
            const data = { mensaje:datos.error }
            return {
                status:'error',
                data:data
            }
        }

    }


    async EnviarActualizacio( formulario: any, BusquedaID:Array<any> ){

        let hayCambios:boolean = this.hayCambiosEnForm( formulario, BusquedaID )


        if( hayCambios ){

            console.log('hay cambios')

            const response = await fetch(this._http + 'movimientos/Divisas/actualizaMovDivisas', {
                method:'POST',
                headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({formulario:formulario})
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


    hayCambiosEnForm( form:any, BusquedaID:Array<any> ){
        
        console.log(form)
        // console.log(BusquedaID[0])
        
        let { Cliente, Fecha, NombreConcepto, alias, ...usuarioData } = BusquedaID[0][0]
        // usuarioData = Object.assign({Id_ModeloNegocio:BusquedaID[0][0].Id_Modelo}, usuarioData)
        // usuarioData = Object.assign({Monto:BusquedaID[0][0].Comision}, usuarioData)

        console.log( {Busqueda:usuarioData})

        for( let i = 0; i< Object.keys(form).length ; i++){
            let valor1 = Object.keys(form)[i]
            for( let j = 0; j < Object.keys(usuarioData).length ; j++){
                let valor2 = Object.keys(usuarioData)[j]
                let val1A = Object.values(form)[i]
                if(valor1 === valor2){
                    if( val1A != Object.values(usuarioData)[j] ){
                        // console.log( valor1, ' - ',valor2)
                        return true
                    }
                }
            }
        }

        return false
    }


    async eliminaDivisas( Id:number, estatus:string, usuario:number ){
        console.log(Id)

        const response = await fetch(this._http + 'movimientos/Divisas/eliminarRegistro', {
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

    async AgregarMovDivisas(formulario: any) {

        const response = await fetch(this._http + 'movimientos/Divisas/agregaMovDivisas', {
           method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({formulario:formulario})
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