import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot, ParamMap } from '@angular/router';

@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [],
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.css'
})
export class Error404Component implements OnInit{
  private _route: any;
  subscriptions: any;

  constructor(
    private router:Router,
    private rutaActiva: ActivatedRoute,
    // private route: ActivatedRouteSnapshot
  ){}

  userLog:string = 'Amigo'

  ngOnInit(): void {

    // this.rutaActiva.params.subscribe(
    //   (params: Params) => {
    //     this.coche.modelo = params.modelo;
    //     this.coche.marca = params.marca;
    //   }
    // );
    // const ruta = this.rutaActiva.snapshot.params["sai"]
    // console.log(ruta)

    // let roles = this.route.data["roles"] as Array<string>;
// this.getId()

    const sesion = localStorage.getItem('sesion');
    if(sesion){

      const { Nombre_Completo } = JSON.parse(sesion!);
      // console.log(Nombre_Completo.split(' ')[0]);
      this.userLog = Nombre_Completo.split(' ')[0]

    }
  }


  // getId():void{
    // this.router.data
    // this.rutaActiva.paramMap.subscribe((params:ParamMap)=>{
    //   this.subscriptions = params.get('roles');
    // })
    // console.log(this.subscriptions)
    // this.subscriptions = this.rutaActiva.params.subscribe(
    //   (response: Params) => {
    //     if(response){ 
    //       console.log(response,response);
    //     }
    //   }, 
    //   err=>{
    //     console.log(err);
    //   }
    // );
  // }

  volver(){
this.router.navigate(['/'])
  }

}
