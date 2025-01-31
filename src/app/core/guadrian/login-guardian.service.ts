import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, UrlTree, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardianService implements CanActivate{

  constructor(
    private AuthService: AuthService,
    private router: Router
  ) { }
  private valorRetorno: boolean =false;


//   canActivate(
//     route: ActivatedRouteSnapshot, state: RouterStateSnapshot
//   ): Observable < boolean | UrlTree > | Promise < boolean | UrlTree > | boolean | UrlTree {
//     return this.checkAuthentication();
//   }

//   async checkAuthentication(): Promise < boolean > {
//     // Implement your authentication in authService
//     const isAuthenticate: boolean = await this.AuthService.isAuthenticado();
//     // console.log(isAuthenticate)
//     return isAuthenticate;
//   }

//   canActivateChild(
//     childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot
//   ): Observable < boolean | UrlTree > | Promise < boolean | UrlTree > | boolean | UrlTree {
//     return this.canActivate(childRoute, state);
//   }
// }


canActivate(): Promise<boolean> | boolean{ 
 
  return this.AuthService.isAuthenticado().then(valor =>{
      this.valorRetorno = valor;
      if(this.valorRetorno) { // <- aquí 'this.valorRetorno' es igual a 'valor' podrías usar directamente el parámetro 'valor'
        //  console.log("COMPROBAMOS: " + this.valorRetorno);
        console.log('Guardian In');
        
        return true; // se resolverá la promesa y Angular sabrá si puede o no activar la ruta
      } else {
        // console.log("Redirigimosssss: ");
        console.log('Guardian Out');
        this.router.navigateByUrl('/login');
        return false; // se resolverá la promesa y Angular sabrá si puede o no activar la ruta
        // return true
   }
  });
  
}
}

//   getCookie(){
//     return document.cookie.split("; ").filter(c=>/^auth_access_token.+/.test(c))
//    .map(e=>e.split("="));
//    // console.log(res[0][0]);

// auth_access_token
//  }
// }
