import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router
  ) { }

  // Metodo de inicio de sesion
  login(email:string, password:string){
    console.log(email, password);
    
    if ( email === 'admin' && password === 'admin'){
      localStorage.setItem('token', 'admin');
      this.router.navigate(['/dashboard']);
      console.log('correcto');
      
      return true;
    }else{
      // console.log('Credenciales incorrectas');
      // alert('Credenciales incorrectas')
      return false;
    }
  }

  // Metodo de verificacion de usuario logeado
  isAuthenticado(){
    if(localStorage.getItem('token')){
      
      return true;
    }else{
      return false;
    }
  }

  // Metodo de cierre de sesion
  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }
}
