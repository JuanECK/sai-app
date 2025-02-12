import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
  })

  export class PerfilGuard implements CanActivate{

    constructor(
        private AuthService: AuthService,
        private router: Router
    ){}
    private perfilRetorno: boolean =false;

    canActivate(): Promise<boolean> | boolean{

        return this.AuthService.showDash( 'inicio' ).then(valor =>{
          this.perfilRetorno = valor;
          if(this.perfilRetorno) { // <- aquí 'this.valorRetorno' es igual a 'valor' podrías usar directamente el parámetro 'valor'
            //  console.log("COMPROBAMOS: " + this.valorRetorno);
            // console.log('INICIO In');
           
            // this.router.navigateByUrl('/inicio');
            return true; // se resolverá la promesa y Angular sabrá si puede o no activar la ruta
          } else {
            // console.log("Redirigimosssss: ");
            // console.log('INICIO Out');
            this.router.navigateByUrl('/sai');
            return false; // se resolverá la promesa y Angular sabrá si puede o no activar la ruta

       }
      });

      }
      
  }

