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
      if (!this.AuthService.login(this.credenciales().get('email')?.value, this.credenciales().get('password')?.value)){
        // this.credenciales().reset();
        this.errorPass = false;
      };
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
