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
    private http: HttpClient,
  ) { }

  dataos = new FormData();
  resapuestaValor:boolean = true

  _http = 'http://localhost:3000/login';
  // _http = 'http://localhost:3000/api/auth/login';



  // Metodo de inicio de sesion
  // login(email:string, password:string){
  //   console.log(email, password);
  //   this.dataos.append( 'data', JSON.stringify({Usuario:email, Contrasenia:password}))
    // this.clienteLogin(this.dataos).subscribe({
    //   next: (res) => {
    //     return res
    //   }
    // }) 
    
    // let respuesta

    // fetch("http://localhost:3000/login", {
    //   method: 'POST',
    //   mode:"cors",
    //   credentials:"same-origin",
    //   headers: {
    //       'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //       Usuario: email,
    //       Contrasenia: password
    //   })
    // })
    //   .then((response) => response.json())
    //   .then((result) => {
    //     respuesta = result
    //     // console.log('Success:', result.error);
    //     respuesta = false;

    //     if(result.error){
         
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });

    //   console.log({Respuesta: respuesta})
    //   return respuesta
  
      // .then((result) => {console.log(result)})
      // .catch((error) => console.error(error));

      // if(response.status === 200){
      //   document.cookie = `auth_access_token=${data.token}; path=/; domain=${location.hostname};`
      // }else if (response.status === 400){
      //   console.log('error de usuaruio y contraseña')
        
      // }

      
      // return this.connect(email, password)
      // this.connect(email, password)
      // console.log(P)
      
      // return true
    
    // if ( email === 'admin' && password === 'admin'){
    //     localStorage.setItem('token', 'admin');
    //     this.router.navigate(['/dashboard']);
    //     console.log('correcto');
      
    //     return true;
    //   }else{
    //       return false;
    //     }
    // }

    connect = async ( usuario:string, contraseña:string) => {
      
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            mode:"cors",
            credentials:"same-origin",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Usuario: usuario,
                Contrasenia: contraseña
            })
        })
        const data = await response.json();
        // console.log(data.token)
        console.log(response.status)
        // return false
  
        if(response.status === 200){
          document.cookie = `auth_access_token=${data.token}; path=/; domain=${location.hostname};`
          this.resapuestaValor = true;
          console.log('correcto')
          // return false
        }else if (response.status === 400){
          console.log('error de usuaruio y contraseña')
          this.resapuestaValor = true;
          // return false
        }

        // console.log(this.resapuestaValor)
        return this.resapuestaValor

        // return true;

      // const myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      // const urlencoded = new URLSearchParams();
      // urlencoded.append("Usuario", usr);
      // urlencoded.append("Contrasenia", cont);

      // const requestOptions = {
      // method: "POST",
      // headers: myHeaders,
      // body: urlencoded,
      // redirect: "follow"
      // };

      // fetch("localhost:3000/login", requestOptions)
      // .then((response) => response.text())
      // .then((result) => console.log(result))
      // .catch((error) => console.error(error));

    }


      clienteLogin(data:any):Observable<any>{
        return this.http.post<any>(this._http,data)
      }

  // Metodo de verificacion de usuario logeado
  isAuthenticado(){
    if(document.cookie.includes('auth_access_token')){

      return true;
    }else{
      return false;
    }
  }

  // Metodo de cierre de sesion
  logOut(){

    const res = document.cookie.split("; ").filter(c=>/^auth_access_token.+/.test(c))
    .map(e=>e.split("="));
    console.log(res[0][1]);

    // let cookie = document.cookie.match(/auth_access_token/g);
    // cookie?.forEach(function(match, index) { console.log(match); });
    // // let code = cookie?.split('=')
    // console.log(cookie)
    // localStorage.removeItem('token');
    // this.router.navigate(['/login'])
  }
}
