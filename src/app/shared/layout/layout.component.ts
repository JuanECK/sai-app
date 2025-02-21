import { Component, Input, OnInit } from '@angular/core';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router, RouterOutlet } from '@angular/router';
import { HeadComponent } from '../head/head.component';

import { environment } from '../../../environments/environments';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeadComponent, SidebarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {



  constructor(
    private router: Router,
  ){}
  componente:any = []
  ruta = 0;

  // mensajeHijo:string = 'ppp'

  // handleEvent(event:any){
  //   this.mensajeHijo = event
  //   console.log(this.mensajeHijo)
  // }

  ngOnInit(): void {
// this.handleEvent
    // console.log('entre a oulet')

    // this.daleRuta()
   
  }

  
  // daleRuta = async () => {
      
  //     const _http:string = `${environment.apiUrl}`
  //     const sesion = localStorage.getItem('sesion');
      
  //     let id = 0
  
  //     if(sesion){
  //       const { Datos } = JSON.parse(sesion!)
  //       id = Datos
  //     }
  
  //     // console.log(id)
  //     const response = await fetch( _http + 'getModuloId',{
  //       method: 'POST',
  //       mode:"cors",
  //       credentials:'include',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         id_user:id
  //       })
  //     })
  //     const data = await response.json()
  //     console.log(data)
  //     return data
  
  // }

}
