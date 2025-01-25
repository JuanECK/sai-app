import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

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
    private router: Router
  ){}
  
  btnEnviar:boolean = true;
  errorPass: boolean = true;
  visualizarPass:boolean = true;

  @ViewChild('inputPassword')
  inputPassword!:ElementRef

  credenciales = signal<FormGroup>(
    new FormGroup({
      email: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required])
    })
  )

  ngOnInit(): void {
    this.isLogin()
  }

  isLogin(){
    if(localStorage.getItem('token')){
      this.router.navigate(['/dasboard']);
    }
  }

  // login(form: NgForm) {
  //   const email = form.value.email;
  //   const password = form.value.password;
  //   this.AuthService.login(email, password);
  //   }

    login(){
    console.log(this.credenciales().value);
    // console.log(this.AuthService.login(this.credenciales().get('email')?.value, this.credenciales().get('password')?.value))
    // let { respuesta } = this.AuthService.login(this.credenciales().get('email')?.value, this.credenciales().get('password')?.value)
    // console.log(respuesta)
    // if(respuesta)
      // if (!this.AuthService.login(this.credenciales().get('email')?.value, this.credenciales().get('password')?.value)){
        // this.credenciales().reset();
        
      //   this.errorPass = false;
      // };


      fetch("http://localhost:3000/login", {
        method: 'POST',
        mode:"cors",
        credentials:"same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Usuario: this.credenciales().get('email')?.value,
            Contrasenia: this.credenciales().get('password')?.value,
        })
      })

      .then(response => {
        if(response.ok) {
            return response.json();
        } else{
          this.errorPass = false;
        }
        throw 'Error en petición';
      })
      .then(data => {
        if(data.token){
          document.cookie = `auth_access_token=${data.token}; path=/; domain=${location.hostname};`
          this.router.navigate(['/dashboard']);
        }
      })
      .catch(error => console.log('error', error));
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
      console.log(this.credenciales().value)
    }

}
