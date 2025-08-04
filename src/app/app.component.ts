import { Component, effect, EnvironmentInjector, HostListener, inject, Injector, OnInit, signal, untracked } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
// import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // para detectar usuarios inactivos
// import * as MomentModule from 'moment'
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthUserActiveService } from './core/services/authUserActive.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthUserActiveService,
    private inject: Injector,
  ) { }
  
  public actividad = signal(true);

  ngOnInit(): void {
    // Activar y desactivar el Cierre de sesion automatico por inactividad
    // this.authService.resetUserActivityTimer()
  }

  @HostListener('window:mousemove') onMouseMove() {
    // @HostListener('mousemove',['$event'])
    this.authService.simulateUserActivity();
  }

  @HostListener('window:keypress') onKeyPress() {
    this.authService.simulateUserActivity();
  }




}
