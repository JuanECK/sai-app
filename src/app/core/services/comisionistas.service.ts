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
        const response = await fetch(this._http + 'generales/estado', {
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
    async getReferido() {
        const response = await fetch(this._http + 'generales/ReferidoComisionista', {
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
    async getReferidoBRK() {
        const response = await fetch(this._http + 'generales/ReferidoBRK', {
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

        const response = await fetch(this._http + 'generales/municipio', {
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

        const response = await fetch( this._http + 'download/comisionistas/'+nameComprobante,{
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
        // ---------------------------------------------------------------------------------------------------------------------

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


    async cargaComisionistaId( id:number ){
        console.log(id)
        const response = await fetch( this._http + 'clientes/comisionistas/cargaComisionista',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({id:id})
        } )
        const datos = await response.json()
        console.log(datos[0])
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

        const response = await fetch( this._http + 'clientes/comisionistas/busqueda',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({criterio:criterio})
        } )
        const datos = await response.json()
        // console.log(datos)
        if( response.status === 200 ){
            return datos;
        }else{
            const data = { mensaje:datos.error }
            return {
                status:'error',
                data:data
            }
        }

    }


    async EnviarActualizacioRegistro( formularioActualizado: FormGroup, InversionistaBusquedaID:Array<any> ){

        let hayCambios:boolean = this.hayCambiosEnForm( formularioActualizado, InversionistaBusquedaID )

        if( hayCambios ){
            
            let aplication = new FormData();
            aplication.append('file', formularioActualizado.value.Comprobante_domicilio )
            aplication.append('file', formularioActualizado.value.INE )
            
            for (const [key, value] of Object.entries(formularioActualizado.value)) {
                if (typeof value != "object") {
                    aplication.append(key, String(value))
                }else{
                    aplication.append(key, '')
                }
            }
            
            const response = await fetch(this._http + 'clientes/comisionistas/actualizaComisionista/comisionistas', {
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
            
            
        }
        
        const data = { mensaje:'No se detectaron modificaciones' } 
        return {
            status: 'edicion',
            data: data 
        }

        // console.log(formularioActualizado.value.Comprobante_domicilio)

    }


    hayCambiosEnForm( form:FormGroup, InversionistaBusquedaID:Array<any> ){

        console.log({'formulario':form.value})
        console.log({'server':InversionistaBusquedaID[0][0]})

        console.log('formulario',Object.keys(form.value).length)
        console.log('server',Object.keys(InversionistaBusquedaID[0][0]).length)

        for( let i = 0; i< Object.keys(form.value).length ; i++){
            let valor1 = Object.keys(form.value)[i]
            // console.log('entre al primer for - ',i)
            for( let j = 0; j < Object.keys(InversionistaBusquedaID[0][0]).length ; j++){
                // console.log('entre al segundo for - ',j)
                let valor2 = Object.keys(InversionistaBusquedaID[0][0])[j]
                // console.log( 'valir1- ',valor1, ' valor2- ',valor2  )
                let val1A = Object.values(form.value)[i] == null ? '': Object.values(form.value)[i]
                if(valor1 === valor2){
                    // console.log('entre a la validacion')
                    if( val1A != Object.values(InversionistaBusquedaID[0][0])[j] ){
                        // console.log('existe un cambio en ', valor1, ' el cambio es ', Object.values(form.value)[i])
                        return true
                    }
                }
            }

        }

        // console.log('no exstio ningun cambio')
        return false

    }

    async RegistraInversionista( formularioInversion: FormGroup ){

        const response = await fetch(this._http + 'clientes/comisionistas/registraInversionista', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(formularioInversion),
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
    async eliminaComisionista( Id_ICPC:number, estatus:string, usuario:number ){

        const response = await fetch(this._http + 'clientes/comisionistas/eliminarRegistro', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify( { Id_ICPC:Id_ICPC, estatus:estatus, usuario:usuario } ),
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

    async AgregarComisionista(formulario: FormGroup) {

        // console.log(formulario.value.INE)
        // console.log(JSON.stringify(formulario))

        let aplication = new FormData();
        aplication.append('file', formulario.value.Comprobante_domicilio)
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