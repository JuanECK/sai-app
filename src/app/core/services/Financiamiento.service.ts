import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class Financiamiento {

    constructor() { }

    private _http: string = `${environment.apiUrl}`;

    async GetDataInicial() {
        const response = await fetch(this._http + 'Financiamiento/cargaDataInicio', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        //   console.log({inicial:data})
        if (response.status === 200) {
            return data
        }
    }

    async getHistorico() {
        const response = await fetch(this._http + 'Financiamiento/cargaHistoricoFinanciamiento', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        console.log({Historico:data})
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

    async descargaComprobante( nameComprobante:string ){
            console.log({comprobante:nameComprobante})
            if(!nameComprobante){
                nameComprobante = 'null'
            }
        const response = await fetch( this._http + 'download/Financiamiento/'+nameComprobante,{
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

    async prestamoPagado( id:number ) {

        const response = await fetch(this._http + 'Financiamiento/prestamo', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ Id: id })
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

    async cargaFinanciamientoId( id:number ){
        // console.log(id)
        const response = await fetch( this._http + 'Financiamiento/cargaFinanciamiento',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({id:id})
        } )
        const datos = await response.json()
        console.log({seleccionado:datos})
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

        const response = await fetch( this._http + 'Financiamiento/busqueda',{
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

            let fileBits:any = []
            let fileName:string = '0SAF0_SAF0.pdf'
            let options:any={type:'application/pdf'}
            let Arr1 = typeof formularioActualizado.value.INE == "object" ? formularioActualizado.value.INE : new File(fileBits , fileName, options)
            let Arr2 = typeof formularioActualizado.value.Contrato == "object" ? formularioActualizado.value.Contrato : new File(fileBits , fileName, options)
            
            console.log(formularioActualizado.value)
            // console.log(formularioActualizado.value.INE, '-', formularioActualizado.value.Contrato)
            // console.log(Arr1, '-', Arr2)

            let aplication = new FormData();
            aplication.append('file', Arr1)
            aplication.append('file', Arr2)
            // aplication.append('file', formulario.value.INE ?? new File(fileBits , fileName, options))
            // aplication.append('file', formulario.value.Contrato ?? new File(fileBits , fileName, options))

            for (const [key, value] of Object.entries(formularioActualizado.value)) {
                if (typeof value != "object") {
                    aplication.append(key, String(value))
                }else{
                    aplication.append(key, '')
                }
            }

            const response = await fetch(this._http + 'Financiamiento/actualizaFinanciamiento/Financiamiento', {
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


    async eliminaFinanciamiento( Id:number, estatus:string, usuario:number ){

        const response = await fetch(this._http + 'Financiamiento/eliminarRegistro', {
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

    async AgregarFinanciamiento(formulario: FormGroup) {
        let fileBits:any = []
        let fileName:string = '0SAF0_SAF0.pdf'
        let options:any={type:'application/pdf'}
        let Arr1 = formulario.value.INE ? formulario.value.INE : new File(fileBits , fileName, options)
        let Arr2 = formulario.value.Contrato ? formulario.value.Contrato : new File(fileBits , fileName, options)

       


        let aplication = new FormData();
        aplication.append('file', Arr1)
        aplication.append('file', Arr2)
        // aplication.append('file', formulario.value.INE ?? new File(fileBits , fileName, options))
        // aplication.append('file', formulario.value.Contrato ?? new File(fileBits , fileName, options))

        for (const [key, value] of Object.entries(formulario.value)) {
            if (typeof value != "object") {
                aplication.append(key, String(value))
            }else{
                aplication.append(key, '')
            }
        }

        const response = await fetch(this._http + 'Financiamiento/agregaFinanciamiento/Financiamiento', {
            method: 'POST',
            body: aplication,
            redirect: "follow"
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
        const data = {mensaje:dataService.mensaje} 
            return {
                status: 'error',
                data: data 
            }
        }
    }

}