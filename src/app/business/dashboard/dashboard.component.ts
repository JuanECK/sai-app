import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PuenteDataService } from '../../core/services/puente-data.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-bashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  constructor(
      private puenteData:PuenteDataService,
      public route:ActivatedRoute,
      private router: Router,
      private location: Location
  ){
    // console.log(this.location.getState());
    // const navigation = this.router.getCurrentNavigation();
    // const state = navigation?.extras.state?
    // console.log(navigation)


  }

public listaModulos:Array<any> = []

  ngOnInit(): void {
    // this.puenteData.disparadorData.subscribe(data =>{
    //   console.log('recibiendo Modulo',data)
    //   // this.listaModulos.push(data)

    // })

  //  this.route.params.subscribe(params => {
  //     let data = params['data']
  //     this.listaModulos.push(data)
  //   })


// this.router.params.subscribe( params =>{
//   this.listaModulos.push(params)
// })

  }

//   crea(params:any){
//  this.puenteData.disparadorLogin.emit(params)
//   }

    ver(){
      console.log('aqui')
      console.log(this.listaModulos)

  }

}
