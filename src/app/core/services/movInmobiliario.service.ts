import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class Inmobiliario {

    constructor() { }

    private _http: string = `${environment.apiUrl}`;

    async GetDataInicial() {
        const response = await fetch(this._http + 'movimientos/Inmobiliario/cargaDataInicio', {
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
        const response = await fetch(this._http + 'movimientos/Inmobiliario/cargaHistoricoInmobiliario', {
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
    async GetConcepto( concepto:string ) {

        const response = await fetch(this._http + 'movimientos/Inmobiliario/cargaConcepto', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ concepto: concepto })
        })
        const data = await response.json()
        if (response.status === 200) {
            return data
        }
    }

    async descargaComprobante( nameComprobante:string ){

        const response = await fetch( this._http + 'download/movInmobiliario/'+nameComprobante,{
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

    async cargaMovInmobiliarioId( id:number ){
        // console.log(id)
        const response = await fetch( this._http + 'movimientos/Inmobiliario/cargaMovInmobiliario',{
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

        const response = await fetch( this._http + 'movimientos/Inmobiliario/busqueda',{
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
            return datos.data;
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
// ---------------------------------------------------------------
            let fileBits:any = []
            let fileName:string = '0SAF0_SAF0.pdf'
            let options:any={type:'application/pdf'}

            let Arr1 = typeof formularioActualizado.value.Comprobante == "object" ? formularioActualizado.value.Comprobante : new File(fileBits , fileName, options)

            let aplication = new FormData();
            aplication.append('file', Arr1)

            // --------------------------------------------------------------
            
            // aplication.append('file', formularioActualizado.value.Comprobante )
          

            for (const [key, value] of Object.entries(formularioActualizado.value)) {
                if (typeof value != "object") {
                    aplication.append(key, String(value))
                }else{
                    aplication.append(key, '')
                }
            }

            const response = await fetch(this._http + 'movimientos/Inmobiliario/actualizaMovInmobiliario/movInmobiliario', {
                method: 'POST',
                body: aplication,
                redirect: "follow"
            })
            const dataService = await response.json()
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
        
        const data = { mensaje:'No se detectaron modificaciones' } 
        return {
            status: 'edicion',
            data: data 
        }

    }


    hayCambiosEnForm( form:FormGroup, BusquedaID:Array<any> ){
        console.log(form.value)
        console.log(BusquedaID)
        
        BusquedaID[0].Comprobante == null ? BusquedaID[0].Comprobante = '': BusquedaID[0].Comprobante
        let { concepto, nombre, Estatus, clabe, Tipo_Movimiento,  ...usuarioData } = BusquedaID[0][0]
        usuarioData = Object.assign({Concepto:usuarioData.Id_Concepto}, usuarioData)
        // console.log( {Busqueda:usuarioData[0]})

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


    async eliminaInmobiliario( Id:number, estatus:string, usuario:number ){

        const response = await fetch(this._http + 'movimientos/Inmobiliario/eliminarRegistro', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify( { Id:Id, estatus:estatus, usuario:usuario } ),
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

    async AgregarMovInmobiliario(formulario: FormGroup) {

        let aplication = new FormData();
        aplication.append('file', formulario.value.Comprobante)

        for (const [key, value] of Object.entries(formulario.value)) {
            if (typeof value != "object") {
                aplication.append(key, String(value))
            }else{
                aplication.append(key, '')
            }
        }

        const response = await fetch(this._http + 'movimientos/Inmobiliario/agregaMovInmobiliario/movInmobiliario', {
            method: 'POST',
            body: aplication,
            redirect: "follow"
        })
        const dataService = await response.json()
        console.log(dataService)
        if (dataService.status === 200) {
            const data = { mensaje:dataService.mensaje }
            return {
                status:'',    
                data: data
            }
        }
        else {
        const data = {mensaje:dataService.mensaje} 
            return {
                status: 'error',
                data: data 
            }
        }
    }

}