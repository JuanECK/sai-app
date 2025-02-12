import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
  })

  // export class ModulAuthorized: CanActivate = (route, state) => {
  export class ModulAuthorized implements CanActivate{

    constructor(
        private AuthService: AuthService,
        private router: Router
    ){}
    private perfilRetorno: boolean =false;

    canActivate(): Promise<boolean> | boolean{

      //   return this.AuthService.showModul().then(valor =>{
      //     this.perfilRetorno = valor;
      //     if(this.perfilRetorno) { // <- aquí 'this.valorRetorno' es igual a 'valor' podrías usar directamente el parámetro 'valor'
      //       //  console.log("COMPROBAMOS: " + this.valorRetorno);
      //       console.log('INICIO In');
          
      //       // this.router.navigateByUrl('/inicio');
      //       return true; // se resolverá la promesa y Angular sabrá si puede o no activar la ruta
      //     } else {
      //       // console.log("Redirigimosssss: ");
      //       console.log('INICIO Out');
      //       this.router.navigateByUrl('');
      //       return false; // se resolverá la promesa y Angular sabrá si puede o no activar la ruta

      //  }
      // });
return false
      }
      

  }

