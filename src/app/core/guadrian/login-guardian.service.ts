import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardianService implements CanActivate{

  constructor(
    private AuthService: AuthService,
    private router: Router
  ) { }
  
  canActivate():boolean {
    if(this.AuthService.isAuthenticado()){
      return true;
    }else{
      this.router.navigate(['/login']);
      return false;
    }
  }
}
