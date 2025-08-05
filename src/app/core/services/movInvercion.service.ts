import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class movInvercion {

    constructor() { }

    private _http: string = `${environment.apiUrl}`;

    async getCuentas() {
        const response = await fetch(this._http + 'movimientos/inversion/cargaCuentasLista', {
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
        const response = await fetch(this._http + 'movimientos/inversion/cargaHistoricoMovInvercion', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        // console.log(data[0])
        if (response.status === 200) {
            return data
        }
    }

        async descargaComprobante( nameComprobante:string ){

        const response = await fetch( this._http + 'download/movInvercion/'+nameComprobante,{
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
    async GetIngresoEgreso() {

        const response = await fetch(this._http + 'movimientos/inversion/cargaEgresoIngreso', {
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
    async cargaCuentaBancaria() {

        const response = await fetch(this._http + 'movimientos/inversion/cargaCuentaBancaria', {
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

    async busquedaInversionista( number:string ) {

        const response = await fetch(this._http + 'movimientos/inversion/cargaNombreInv', {
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

    async setAsignacion( formulario:any ) {

        const response = await fetch(this._http + 'movimientos/inversion/asigna', {
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


    async cargaMovInvercionId( id:number ){
        // console.log(id)
        const response = await fetch( this._http + 'movimientos/inversion/cargaMovInvercion',{
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

        const response = await fetch( this._http + 'movimientos/inversion/busqueda',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({criterio:criterio})
        } )
        const datos = await response.json()
        if( datos.status === 200 ){
            if( datos.status === 'error' ){
                const data = { mensaje:datos.mensaje }
                return {
                    status:'error',
                    data:data
                }
            }
            console.log(datos)
            return datos.data;
        }else{
            const data = { mensaje:datos.mensaje }
            return {
                status:'error',
                data:data
            }
        }

    }


    async EnviarActualizacio( formularioActualizado: FormGroup, BusquedaID:Array<any> ){


        let hayCambios:boolean = this.hayCambiosEnForm( formularioActualizado, BusquedaID[0] )

        if( hayCambios ){
            
                let aplication = new FormData();
                aplication.append('file', formularioActualizado.value.Comprobante )
                // aplication.append('file', formularioActualizado.value.INE )
                
                for (const [key, value] of Object.entries(formularioActualizado.value)) {
                    if (typeof value != "object") {
                        aplication.append(key, String(value))
                    }else{
                        aplication.append(key, '')
                    }
                }
                
                const response = await fetch(this._http + 'movimientos/inversion/actualizaMovInvercion/movInvercion', {
                    method: 'POST',
                    body: aplication,
                    redirect: "follow"
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

            // }



            
        }
        
        const data = { mensaje:'No se detectaron modificaciones' } 
        return {
            status: 'edicion',
            data: data 
        }

    }


    hayCambiosEnForm( form:FormGroup, BusquedaID:Array<any> ){
        // console.log({form: form.value})
        
        BusquedaID[0].Comprobante == null ? BusquedaID[0].Comprobante = '': BusquedaID[0].Comprobante
        const { Fecha_Captura, clabe, codigo, nombre,  ...usuarioData } = BusquedaID[0]
        
        // console.log( {Busqueda:usuarioData})

        for( let i = 0; i< Object.keys(form.value).length ; i++){
            let valor1 = Object.keys(form.value)[i]
            for( let j = 0; j < Object.keys(usuarioData).length ; j++){
                let valor2 = Object.keys(usuarioData)[j]
                let val1A = Object.values(form.value)[i]
                // let val1A = Object.values(form.value)[i] == null ? '': Object.values(form.value)[i]
                if(valor1 === valor2){
                    if( val1A != Object.values(usuarioData)[j] ){
                        console.log( valor1, ' - ',valor2)
                        return true
                    }
                }
            }
        }

        return false
    }


    async eliminaObservacion( Id:number, estatus:string, usuario:number ){

        const response = await fetch(this._http + 'movimientos/inversion/eliminarRegistro', {
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

    async AgregarMovInvercion(formulario: FormGroup) {

        // console.log(formulario.value.Comprobante)

        if(formulario.value.Comprobante == ''){

            const response = await fetch(this._http + 'movimientos/inversion/agregaMovInvercionSimple', {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({formulario:formulario.value}) ,
                // redirect: "follow"
            })
            const dataService = await response.json()
            // console.log(dataService)
            if (dataService.status === 200) {
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

        }else{

                  let aplication = new FormData();
        aplication.append('file', formulario.value.Comprobante)
        // aplication.append('file', formulario.value.INE)
        // , formulario.value.Comprobante_domicilio
        // aplication.append('file', JSON.stringify(formulario))


        for (const [key, value] of Object.entries(formulario.value)) {
            if (typeof value != "object") {
                aplication.append(key, String(value))
            }else{
                aplication.append(key, '')
            }
        }


        const response = await fetch(this._http + 'movimientos/inversion/agregaMovInvercion/movInvercion', {
            method: 'POST',
            body: aplication,
            redirect: "follow"
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

}