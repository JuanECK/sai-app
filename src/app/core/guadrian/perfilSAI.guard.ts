import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
  })


  export class PerfilSAIGuard implements  CanActivate{

    constructor(
        private AuthService: AuthService,
        private router: Router
    ){}
    private PerfilSaiRetorno: boolean =false;

    canActivate(): Promise<boolean> | boolean{

        return this.AuthService.showDash( 'sai' ).then(valor =>{
          this.PerfilSaiRetorno = valor;
          if(this.PerfilSaiRetorno) { // <- aquí 'this.valorRetorno' es igual a 'valor' podrías usar directamente el parámetro 'valor'
            // console.log('SAI In');

            return true; // se resolverá la promesa y Angular sabrá si puede o no activar la ruta
          } else {
            // console.log('SAI Out');
            this.router.navigateByUrl('/Dashboard');
            return false; // se resolverá la promesa y Angular sabrá si puede o no activar la ruta

       }
      });

    }
      
  }