import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [],
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.css'
})
export class Error404Component implements OnInit{

  constructor(
    private router:Router
  ){}

  userLog:string = 'Amigo'

  ngOnInit(): void {
    const sesion = localStorage.getItem('sesion');
    if(sesion){

      const { Nombre_Completo } = JSON.parse(sesion!);
      // console.log(Nombre_Completo.split(' ')[0]);
      this.userLog = Nombre_Completo.split(' ')[0]

    }
  }


  volver(){
this.router.navigate(['/Inicio'])
  }

}
