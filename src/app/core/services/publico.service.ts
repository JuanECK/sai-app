import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class Publico {

    constructor() { }

    private _http: string = `${environment.apiUrl}`;


    async GetDataInicial() {
        const response = await fetch(this._http + 'clientes/Publico/dataInicial', {
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


    async cargaProveedorId( id:number ){
        console.log(id)
        const response = await fetch( this._http + 'clientes/Publico/cargaPublico',{
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

    async busqueda( criterio:string ){

        const response = await fetch( this._http + 'clientes/Publico/busqueda',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({criterio:criterio})
        } )
        const datos = await response.json()
        // console.log(datos)
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


    async EnviarActualizacioProveedor( formularioActualizado: FormGroup, BusquedaID:Array<any> ){

        let hayCambios:boolean = this.hayCambiosEnForm( formularioActualizado, BusquedaID )


        if( hayCambios ){
            
            console.log('cambios')

            const response = await fetch(this._http + 'clientes/Publico/actualizaPublico', {
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

        console.log(form.value)
        // console.log(BusquedaID)
        
        // BusquedaID[0].Comprobante == null ? BusquedaID[0].Comprobante = '': BusquedaID[0].Comprobante
        let { Id_Tipo_ClienteDivisa,Saldo_Apertura,Id_Moneda,Banco_Tarjeta,  ...usuarioData } = BusquedaID[0]
        // usuarioData.push({'Concepto':usuarioData.Id_Concepto})
        usuarioData = Object.assign({tipoClienteDivisa:Id_Tipo_ClienteDivisa},{saldoApertura:Saldo_Apertura},{tipoDivisa:Id_Moneda},{Banco_tarjeta:Banco_Tarjeta}, usuarioData)
        // console.log(typeof usuarioData)
        
        console.log( {Busqueda:usuarioData})

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
        // console.log(BusquedaID)
        // console.log(form)

        // for( let i = 0; i< Object.keys(form.value).length ; i++){
        //     let valor1 = Object.keys(form.value)[i]
        //     for( let j = 0; j < Object.keys(BusquedaID[0]).length ; j++){
        //         let valor2 = Object.keys(BusquedaID[0])[j]
        //         let val1A = Object.values(form.value)[i] == null ? '': Object.values(form.value)[i]
        //         if(valor1 === valor2){
        //             if( val1A != Object.values(BusquedaID[0])[j] ){
        //                 return true
        //             }
        //         }
        //     }
        // }

        // return false
    }


    async eliminaProveedor( Id_ICPC:number, estatus:string, usuario:number ){

        const response = await fetch(this._http + 'clientes/Publico/eliminarRegistro', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify( { Id_ICPC:Id_ICPC, estatus:estatus, usuario:usuario } ),
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
            const data = { mensaje:dataService.mensaje } 
            return {
                status: 'error',
                data: data 
            }
        }

    }

    async AgregarProveedor(formulario: FormGroup) {

        const response = await fetch(this._http + 'clientes/Publico/agregaPublico', {
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