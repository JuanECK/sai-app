import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { PuenteDataService } from '../../../core/services/puente-data.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  
  constructor(
    private AuthService: AuthService,
    private router: Router,
    private emitDataLogin: PuenteDataService,
  ){}
  
  btnEnviar:boolean = true;
  errorPass: boolean = true;
  visualizarPass:boolean = true;
  private usuarioRetorno: boolean =false;

  @ViewChild('inputPassword')
  inputPassword!:ElementRef

  credenciales = signal<FormGroup>(
    new FormGroup({
      email: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required])
    })
  )

  ngOnInit(): void {
    // console.log(this.AuthService.getCookie().length)
    if(window.location.pathname === '/login' && localStorage.getItem('sesion') ){
     this.router.navigate(['/Inicio'])
   }


    // this.isLogin()
  }

  // isLogin(){
  //   if(localStorage.getItem('token')){
  //     this.router.navigate(['/dasboard']);
  //   }
  // }

  // login(form: NgForm) {
  //   const email = form.value.email;
  //   const password = form.value.password;
  //   this.AuthService.login(email, password);
  //   }

  // login(){
    login():Promise<boolean> | boolean{

      const usuario = this.credenciales().get('email')?.value;
      const contrasenia = this.credenciales().get('password')?.value;

      return this.AuthService.login( usuario, contrasenia ).then(valor =>{
        this.usuarioRetorno = valor.log
        if(this.usuarioRetorno){
          // console.log("COMPROBAMOS-USUARIO: " + this.usuarioRetorno);
          // const { Clave_Usuario, Usuario, ...UsuarioData } = valor.data.user
          const {Usuario, ...UsuarioData } = valor.data.user
          localStorage.setItem('sesion', JSON.stringify(UsuarioData));
          // const { Nombre_Completo, ...UsuarioD} = UsuarioData 
          // this.emitDataLogin.disparadorLogin.emit(UsuarioD)
          this.router.navigate(['/Inicio']);
          return true;
        }else{
          // console.log("Redirigimosssss: ");
          this.errorPass = false;
          return false;
        }
      })

// ------------------------------------------------
// -------Funcionando----------

      // fetch("http://localhost:3000/login", {
      //   method: 'POST',
      //   // mode:"cors",
      //   credentials:"include",
      //   headers: {
      //       'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //       Usuario: this.credenciales().get('email')?.value,
      //       Contrasenia: this.credenciales().get('password')?.value,
      //   })
      // })

      // .then(response => {
      //   if(response.ok) {
      //       return response.json();
      //   } else{
      //     this.errorPass = false;
      //     // console.clear()
      //   }
      //   throw 'Error en petición';
      // })

      // .then(data => {
      //   const { Clave_Usuario, Usuario, ...UsuarioData } = data.user
      //   localStorage.setItem('sesion', JSON.stringify(UsuarioData));
      //     this.router.navigate(['/Inicio']);
      // })
      // .catch(error => console.log('error', error));
      // ------------------------------------------------
    }


    formImputComplete(){

      if(this.credenciales().valid){
        this.btnEnviar = false;
      }else{
        this.btnEnviar = true;
      }
      
    }

    evaluaMssjError(){
      if(this.errorPass == false){
        this.errorPass = true;
      }
    }

    visualizarPassword(){
      if(this.visualizarPass == true){
        this.visualizarPass = false;
        this.inputPassword.nativeElement.type = "text"
      }else{
        this.visualizarPass = true
        this.inputPassword.nativeElement.type = "password"
      }
    }

    ver(){
      console.log(this.AuthService.isAuthenticado())
      // console.log(this.credenciales().value)
    }

}
