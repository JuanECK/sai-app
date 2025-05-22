import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isModAuthGuard: CanActivateFn = (route, state): MaybeAsync<GuardResult> => {
  
  const roles = route.data?.['roles'] as string[]
  let perfilRetorno: boolean =false;
  const router = inject(Router)

  return inject(AuthService).showModul(roles).then(valor =>{
    perfilRetorno = valor;
    if(perfilRetorno) { 
      // console.log('INICIO In');
    
      // this.router.navigateByUrl('/inicio');
      return true; 
    } 
    // else {
      // console.log('INICIO Out');
      // state.url['/']
      // inject(Router).navigateByUrl('')
      // router.navigate(['/sai']);

      return router.createUrlTree(['/sai']); 
      // return false
      
    // }
});
  // console.log(roles)
  // return true;
};
