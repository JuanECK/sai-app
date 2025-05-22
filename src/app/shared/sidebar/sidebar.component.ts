import { Component,  ElementRef,  EventEmitter,  Input,  OnInit, Output, ViewChild ,AfterContentInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HeadService } from '../../core/services/head.service';
import { PuenteDataService } from '../../core/services/puente-data.service';
// import { PuenteDataService } from '../../core/services/puente-data.service';

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
 

// @ViewChild('aside',{static: false}) aside!: ElementRef;

  sesion = localStorage.getItem('sesion');
  modulos:any
  public arrLista:any = []
  dataLogin:any=[]
  dataSidebar:any


  @Output () migajaEvent: EventEmitter<string> = new EventEmitter();



   ngOnInit(): void {
    
    this.getModulo()
    this.getDataLogin()
  }
  
  ngAfterContentInit() {

  }

  getDataLogin(){

    this.puenteData.disparadorData.subscribe(data =>{
          this.dataSidebar = data
          // console.log(data)

          const asideElement = document.getElementById('miAside')!
          if(data.poisionX === 'dash'){
            asideElement.classList.remove('nuevoAsit')
            return
          }
          asideElement.classList.add('nuevoAsit')

          // asideElement.style.left = data.poisionX ;
          // asideElement.style.backgroundColor = 'lightblue';
          // asideElement.style.padding = '20px';
          // asideElement.style.border = '1px solid black';

    })
   
  }

  async getModulo(){
    let id = 0;
    let padre = 0
    // const arrLista:any = []
    if( this.sesion ){
      const { Datos } = JSON.parse(this.sesion!)
      const resultado = await this.headService.getModulos( Datos )
      // console.log(resultado)

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
      // console.log(this.arrLista)
      // this.puenteData.disparadorLogin.emit(this.arrLista)
      
    }
  }


}
