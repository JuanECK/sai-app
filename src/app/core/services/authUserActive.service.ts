
import { effect, Injectable, Injector, signal, untracked, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';
import { PuenteDataService } from './puente-data.service';

////usuario Activo
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { time } from 'console';
import { promises } from 'dns';
import { AuthService } from './auth.service';
//////////


@Injectable({
  providedIn: 'root'
})


export class AuthUserActiveService {

  private userActivity$: Subject<void> = new Subject<void>();
  
  constructor(
    private router: Router,
    private inject:Injector,
    private auth:AuthService,
    // private puenteData:PuenteDataService,
    // private http: HttpClient,
  ) { }

  public actividad = signal(true);
  private time:any;
   private _http:string = `${environment.apiUrl}`

  
  resetUserActivityTimer() {
 
    effect(()=>{

      if(this.actividad()){

        if(this.time){
          clearTimeout(this.time)
        }

        this.time = setTimeout(()=>{
          this.logOut()
        },180000)
        
        untracked(()=>{
          this.actividad.set(false);
        })
        
      }
      
    },{injector:this.inject})
  }
  
  simulateUserActivity() {
    
    this.actividad.set(true);
  }
  
  logOut(){
    if(this.auth.getIDAuth()){
      // alert('session terminada')
      this.isAuthenticado()
    }
  }

  async isAuthenticado(){
    
    const response = await fetch(this._http + 'auth/cookie', {
      method: 'POST',
      // mode:"cors",
      credentials:"include",
      headers: {
        'Content-Type': 'application/json'
      },

    })
    const data = await response.json();
    if(data.respuesta === true){
      this.auth.logOut()
    }
    
    // return dataCookie
    
  }
  // // Method to logout user
  // logout(): void {
  //   console.log('deslogeeo')
  //   // this.router.navigate(['/Movimientos/Comisión']);
  //   // Perform logout logic here, such as clearing session data and navigating to login page
  // }




//   dataos = new FormData();
//   resapuestaValor:boolean = true;
//   private _http:string = `${environment.apiUrl}`
  
  
//   // Metodo de inicio de sesion
//   async login(email:string, password:string){
//     try {
      
//       let dataCookie:boolean = true
//       const response = await  fetch(this._http +"auth/login", {
//         method: 'POST',
//         // mode:"cors",
//         credentials:"include",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             Usuario: email,
//             Contrasenia: password,
//         })
//       })
//       const data = await response.json();
//       // console.log(data);

//       if(response.status === 200){
//         dataCookie = true
//       }else{
//         dataCookie = false
//       }
      
//       return {
//         log:dataCookie,
//         data:data
//       }

//     } catch (error) {
//       throw new Error()
//     }


//   }

//   // Metodo de verificacion de usuario logeado
//   async isAuthenticado(){
    
//     let dataCookie:boolean = true
    
//     const response = await fetch(this._http + 'auth/cookie', {
//       method: 'POST',
//       // mode:"cors",
//       credentials:"include",
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       // body: JSON.stringify({
//       //   // Usuario: coockie,
//       //   Token: coockie[0][1],
//       // })
//     })
//     const data = await response.json();
//     if(data.respuesta === true){
//       dataCookie = true
//     }else{
//       dataCookie = false
//       this.logOut();
//     }
    
//     return dataCookie
    
//   }
  
//   // Metodo de cierre de sesion
//   async logOut(){
//     // const sesion = localStorage.getItem('sesion');
//     // let id = 0

//     // if(sesion){
//     //   const { Datos } = JSON.parse(sesion!)
//     //   id = Datos
//     //   // id = Id_User
//     // }

//     let id = this.getID();

//       const response = await fetch( this._http + 'auth/logOut',{
//         method: 'POST',
//         mode:"cors",
//         credentials:'include',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           id_user:id
//         })
//       })

//       const data= await response.json()
//       // console.clear()
//       // console.log(data)
//       if(data.logOut){
//         localStorage.removeItem('sesion');
//         this.router.navigate(['/login']);
//       }
//   }


//   // ---------------------------------------------------

//   async showDash( perfil:string ){
//   // let componente:any = []
//   let respuestaPerfil:boolean = true;
    
//     // const sesion = localStorage.getItem('sesion');
//     // let id = 0
//     // if(sesion){
//     //   const { Datos } = JSON.parse(sesion!)
//     //   id = Datos
//     // }

//     let id = this.getID();
//     const response = await fetch( this._http + 'auth/getModuloId',{
//       method: 'POST',
//       mode:"cors",
//       credentials:'include',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         id_user:id
//       })
//     })
//     const data = await response.json()
//     // console.log(data)
    
//     switch (perfil){
//       case 'inicio':
//         if(data == 1 || data == 2){
//            respuestaPerfil = true;
//           }else{
//           respuestaPerfil = false;
//         }
//         break;

//         case 'sai':
//           // console.log('entre a sai')
//           if( data > 2){
//             // console.log('sai es true')
//             respuestaPerfil = true;
//           }else{
//             // console.log('sai es falso')
//             respuestaPerfil = false;
//           }
//         break;
//       }
      
//       return respuestaPerfil;


//     // return data
// }



// async showModul ( roles:any ) {
//   let respuestaModulo:boolean = true;
// let id = this.getID();
// // console.log(id)

// const response = await fetch( this._http + "auth/modulo", {
//   method: 'POST',
//   credentials: 'include',
//   headers: {
//        'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//       id: id
//   }) 
// } )   
// const data = await response.json()
// // console.log(data)

// for(let i=0; i < data[0].length; i++){
//   if(data[0][i].moduloPadre == roles[0]){
//     respuestaModulo = true
//     break
//   }else{
//     respuestaModulo = false
//   }
// }

//   return respuestaModulo

// }

// getID(){
//   const sesion = localStorage.getItem('sesion');
//   const { Datos } = JSON.parse(sesion!)
//   return Datos
// }


// ------------------------------------------------------------------------------
}