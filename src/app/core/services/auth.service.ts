import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  
  constructor(
    private router: Router,
    // private http: HttpClient,
  ) { }
  
  dataos = new FormData();
  resapuestaValor:boolean = true
  Cookie:boolean = true
  
  _http = 'http://localhost:3000/';
  // _http = 'http://localhost:3000/api/auth/login';



  // Metodo de inicio de sesion
  async login(email:string, password:string){

    try {
      
      let dataCookie:boolean = true
      const response = await  fetch("http://localhost:3000/login", {
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
    
    // const coockie = this.getCookie();
    // if(coockie.length === 0) return false
    
    // console.log(coockie)
    let dataCookie:boolean = true
    
    const response = await fetch(this._http + 'cookie', {
    // const response = await fetch(this._http + 'validaSession', {
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
      console.log(data);
      dataCookie = true
    }else{
      // console.log(dato);
      console.log(data.respuesta);
      dataCookie = false
      this.logOut();
    }
    
    return dataCookie
    
  }
  
  // Metodo de cierre de sesion
  async logOut(){
    // const res = this.getCookie()
    // document.cookie = res[0][0] + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // this.router.navigate(['/login'])
    const response = await fetch( this._http + 'logOut',{
      method: 'GET',
      credentials:'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data= await response.json()
    console.log(data)
    if(data.logOut){
      localStorage.removeItem('sesion');
      this.router.navigate(['/login']);
    }
  }
  
  getCookie(){
    return document.cookie.split("; ").filter(c=>/^auth_access_token.+/.test(c))
    .map(e=>e.split("="));
    // console.log(res[0][0]);
  }
}
// clienteLogin(data:any):Observable<any>{
//   return this.http.post<any>(this._http,data)
// }
