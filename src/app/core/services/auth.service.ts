import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';
import { PuenteDataService } from './puente-data.service';


@Injectable({
  providedIn: 'root'
})


export class AuthService {
  
  constructor(
    private router: Router,
    private puenteData:PuenteDataService,
    // private http: HttpClient,
  ) { }
  
  dataos = new FormData();
  resapuestaValor:boolean = true;
  private _http:string = `${environment.apiUrl}`
  
  
  // Metodo de inicio de sesion
  async login(email:string, password:string){
    try {
      
      let dataCookie:boolean = true
      const response = await  fetch(this._http +"auth/login", {
        method: 'POST',
        // mode:"cors",
        credentials:"include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Usuario: email,
            Contrasenia: password,
        })
      })
      const data = await response.json();
      // console.log(data);

      if(response.status === 200){
        dataCookie = true
      }else{
        dataCookie = false
      }
      
      return {
        log:dataCookie,
        data:data
      }

    } catch (error) {
      throw new Error()
    }


  }

  // Metodo de verificacion de usuario logeado
  async isAuthenticado(){
    
    let dataCookie:boolean = true
    
    const response = await fetch(this._http + 'auth/cookie', {
      method: 'POST',
      // mode:"cors",
      credentials:"include",
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({
      //   // Usuario: coockie,
      //   Token: coockie[0][1],
      // })
    })
    const data = await response.json();
    if(data.respuesta === true){
      dataCookie = true
    }else{
      dataCookie = false
      this.logOut();
    }
    
    return dataCookie
    
  }
  
  // Metodo de cierre de sesion
  async logOut(){
    // const sesion = localStorage.getItem('sesion');
    // let id = 0

    // if(sesion){
    //   const { Datos } = JSON.parse(sesion!)
    //   id = Datos
    //   // id = Id_User
    // }

    let id = this.getID();

      const response = await fetch( this._http + 'auth/logOut',{
        method: 'POST',
        mode:"cors",
        credentials:'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_user:id
        })
      })

      const data= await response.json()
      // console.clear()
      // console.log(data)
      if(data.logOut){
        localStorage.removeItem('sesion');
        this.router.navigate(['/login']);
      }
  }


  // ---------------------------------------------------

  async showDash( perfil:string ){
  // let componente:any = []
  let respuestaPerfil:boolean = true;
    
    // const sesion = localStorage.getItem('sesion');
    // let id = 0
    // if(sesion){
    //   const { Datos } = JSON.parse(sesion!)
    //   id = Datos
    // }

    let id = this.getID();

    const response = await fetch( this._http + 'auth/getModuloId',{
      method: 'POST',
      mode:"cors",
      credentials:'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_user:id
      })
    })
    const data = await response.json()
    // console.log(data)
    
    switch (perfil){
      case 'inicio':
        if(data == 1 || data == 2){
           respuestaPerfil = true;
          }else{
          respuestaPerfil = false;
        }
        break;

        case 'sai':
          // console.log('entre a sai')
          if( data > 2){
            // console.log('sai es true')
            respuestaPerfil = true;
          }else{
            // console.log('sai es falso')
            respuestaPerfil = false;
          }
        break;
      }
      
      return respuestaPerfil;


    // return data
}



async showModul ( roles:any ) {
  let respuestaModulo:boolean = true;
let id = this.getID();


const response = await fetch( this._http + "auth/modulo", {
  method: 'POST',
  credentials: 'include',
  headers: {
       'Content-Type': 'application/json'
  },
  body: JSON.stringify({
      id: id
  }) 
} )   
const data = await response.json()
// console.log(data)

for(let i=0; i < data[0].length; i++){
  if(data[0][i].moduloPadre == roles[0]){
    respuestaModulo = true
    break
  }else{
    respuestaModulo = false
  }
}

  return respuestaModulo

}

getID(){
  const sesion = localStorage.getItem('sesion');
  const { Datos } = JSON.parse(sesion!)
  return Datos
}

// getInfo () {
//   this.puenteData.disparadorData.subscribe(data =>{
//     console.log('recibiendo Modulo',data)
    
//   })
// }
  
  
  // getCookie(){
  //   return document.cookie.split("; ").filter(c=>/^auth_access_token.+/.test(c))
  //   .map(e=>e.split("="));
  //   // console.log(res[0][0]);
  // }
}
// clienteLogin(data:any):Observable<any>{
//   return this.http.post<any>(this._http,data)
// }
