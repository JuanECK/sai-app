import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { servicioGuardian } from '../../core/services/servisio';

@Component({
  selector: 'app-head',
  standalone: true,
  imports: [],
  templateUrl: './head.component.html',
  styleUrl: './head.component.css'
})
export class HeadComponent implements OnInit {

constructor(
  private AuthService: AuthService,
){}

usuarioLogueado:string = 'usuario'

  ngOnInit(): void {
   const sesion = localStorage.getItem('sesion')
   const { Id_User, Nombre_Completo } = JSON.parse( JSON.stringify( sesion ) )
   this.usuarioLogueado = Nombre_Completo
   console.log(Nombre_Completo)
  }

salir() {
this.AuthService.logOut()
;}

ver(){
  console.log(this.AuthService.isAuthenticado())

  // console.log(this.credenciales().value)
}

}
