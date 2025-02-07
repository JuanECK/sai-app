import { Component,  EventEmitter,  Input,  OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HeadService } from '../../core/services/head.service';
import { PuenteDataService } from '../../core/services/puente-data.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  constructor(
    private headService:HeadService,
    private puenteData:PuenteDataService
  ){}
 

  sesion = localStorage.getItem('sesion');
  modulos:any
  public arrLista:any = []
  dataLogin:any=[]


   ngOnInit(): void {

   
//  this.dataLogin.push(this.data()) 
// console.log('esto',this.data())
    this.getModulo()


   
  }

  data(){
    // this.puenteData.disparadorLogin.subscribe({
    //   next: (data:any) => {
    //     console.log(data)
    //     this.dataLogin.push(data)
    //   }
    // })

   

    
  }

  // verData(){
  //   // console.log(this.dataLogin)
  //   this.puenteData.disparadorLogin.subscribe(data =>{
  //     console.log('recibiendo Login',data) 
  //   })
  // }

  async getModulo(){
    let id = 0;
    let padre = 0
    // const arrLista:any = []
    if( this.sesion ){
      const { Datos } = JSON.parse(this.sesion!)
      const resultado = await this.headService.getModulos( Datos )
      console.log(resultado)

      resultado[0].map((dato:any)=>{ 
        if( id !== dato.Id_moduloPadre ){

          if(id !== 0){
            padre++
          }

          id = dato.Id_moduloPadre
          const arrListaA = [dato.moduloPadre,[{moduloHijo:dato.moduloHijo ,Id_moduloHijo:dato.Id_moduloHijo}]]
          this.arrLista.push(arrListaA)

        }else {

          const arrListaA = {moduloHijo:dato.moduloHijo ,Id_moduloHijo:dato.Id_moduloHijo}
          this.arrLista[padre][1].push(arrListaA)

        }
      })
      // this.puenteData.disparadorData.emit(this.arrLista)
      
    }
  }


}
