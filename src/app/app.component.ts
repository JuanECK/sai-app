import { Component, effect, HostListener, Injector, OnInit, signal, untracked} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
// import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // para detectar usuarios inactivos
// import * as MomentModule from 'moment'
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthUserActiveService } from './core/services/authUserActive.service';


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(
    private authService: AuthUserActiveService,
     private inject:Injector,
  ) {}


   public actividad = signal(true);
    private time:any;

  ngOnInit(): void {
    this.authService.resetUserActivityTimer(5000)
    // this.resetUserActivityTimer()
  }

    @HostListener('window:mousemove') onMouseMove() {
    // @HostListener('window:mousemove')
    // @HostListener('mousemove',['$event'])
      // console.log('mousemove')
    this.authService.simulateUserActivity();
    // public enviarMouse(btn:any){
      // this.actividad.set(true);
    }
  

  @HostListener('window:keypress') onKeyPress() {   
    this.authService.simulateUserActivity();
  }

    resetUserActivityTimer() {

      effect(()=>{
  
        if(this.actividad()){
  
          if(this.time){
            clearTimeout(this.time)
          }
  
          this.time = setTimeout(()=>{
            console.log('deslogeadoAPP')
          },5000)
  
          untracked(()=>{
            this.actividad.set(false);
          })
  
        }
  
      },{injector:this.inject})
    }




}
