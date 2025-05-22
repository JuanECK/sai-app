import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { PuenteDataService, Persona} from '../../core/services/puente-data.service';

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
    private puenteData:PuenteDataService

  ){}
  
  usuarioLogueado:string = 'usuario'
  dataHead:any

    
  ngOnInit(): void {
    const sesion = localStorage.getItem('sesion')
    const { Id_User, Nombre_Completo } = JSON.parse(sesion!);
    this.usuarioLogueado = Nombre_Completo

    this.getDataLogin()

    if(!this.dataHead){
      this.dataHead = {dato:'Inicio'} 
    }
  }
  
  getDataLogin(){

    this.puenteData.disparadorData.subscribe(data =>{
          this.dataHead = data
    })
   
  }

  // setDataLogin() {
  //  this.puenteData.disparadorData.emit({dato:'aaaaaaaaaaa'})
  // }
  
//   async pruebaCoockie() {
//     // 
//     //  console.log(coock)
//     const response = await fetch(this._http + 'session', {
//     // const response = await fetch(this._http + 'cookie', {
//       method: 'POST',
//       // mode:"cors",
//       credentials:"include",
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body:JSON.stringify({
//         Usuario: 'Juann@fincash.com',
//         Contrasenia:'123456'
//       })
//     })
//     const data = await response.json();
//     console.log(data)
//   }
  
salir() {
this.AuthService.logOut()
;}

ver(){

  console.log(this.dataHead)
  // console.log(this.AuthService.isAuthenticado())

  // console.log(this.credenciales().value)
}


}
