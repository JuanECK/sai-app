import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PuenteDataService } from '../../core/services/puente-data.service';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environments';
import { PipeTransform } from '@angular/core'
import { formatCurrency } from '@angular/common';
import { ModalMsgService } from '../../core/services/modal-msg.service';
import { ModalMsgComponent } from '../../core/modal-msg/modal-msg.component';




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
  ){

  }



  //   this.inputs = document.querySelectorAll('#table-diferencia-saldos input');
  //   console.log(this.inputs)


  
  public listaModulos:Array<any> = []
  public Array:Array<any>[] = []
  public _http:string = `${environment.apiUrl}`
  public inputs:any
  public buttons:any

    private readonly _modalMsg = inject(ModalMsgService);

  ngOnInit(): void {
    this.setDataLogin();
    this.getDataInicio();

  }

  getCurrencySaldo(event: any) {
    let value = event.target.value
    let returnvalor = value
    if (value != '') {
      this.activeDisabledBtn( event )
      returnvalor = formatCurrency(+value, 'en', '', '', '1.2-4')
      // this.formulario().patchValue({ ['saldoInicial']: returnvalor.replace(/[^0-9.]/g, "") })
      event.target.value = returnvalor
      return
    }
      this.activeDisabledBtn( event )
    // this.formulario().patchValue({ ['saldoInicial']: 0 })
    event.target.value = returnvalor
  }

  activeDisabledBtn( event:any ){
     this.buttons = document.querySelectorAll('#table-diferencia-saldos button');
    //  console.log('evento input',event.target.value)
    for(let i = 0; i < this.buttons.length; i++){
      if(event.target.id === this.buttons[i].id){
        if(!event.target.value){
          this.buttons[i].classList.remove('btn-DS-Active');
          this.buttons[i].disabled = true;
          break
        }
        // console.log('el botoon es',this.buttons[i].class)
        this.buttons[i].classList.add('btn-DS-Active');
        this.buttons[i].disabled = false;
      }
    }
  }

  parseDigito2(event: any) {
    let cadena = event.target.value;
    let numPuntos = 0
    cadena = cadena
      .replace(/[^0-9.]/g, "");
    for (let i = 0; i < cadena.length; i++) {
      if (cadena[0] === '.') {
        cadena = cadena.slice(1)
      }
      if (cadena[i] === '.') {
        numPuntos++
        if (numPuntos > 1) {
          cadena = cadena.slice(0, i)
        }
      }
      if (cadena[i] === '.') {
        let res = cadena.slice(i, cadena.length)
        if (res.length > 5) {
          cadena = cadena.slice(0, cadena.length - 1)
        }
      }

    }
    event.target.value = cadena
  }

  setDataLogin() {
    this.puenteData.disparadorData.emit({dato:'Inicio', poisionX: 'dash'})
   }

   async getDataInicio(){


    const respuesta = await fetch( this._http + 'inicio/dashboard',{
      method:'GET',
      headers:{
        'Content-Type': 'application/json'
      },
    })
    const data = await respuesta.json();
    this.Array = data
    console.log(this.Array)
   }

   getCurrency(value:number){
    return formatCurrency(value, 'en', '$', '','1.2-4')
   }



   ver(event:any){
     this.buttons = document.querySelectorAll('#table-diferencia-saldos button');
    //  console.log('evento input',event.target.value)
    for(let i = 0; i < this.buttons.length; i++){
      if(event.target.id === this.buttons[i].id){
        if(!event.target.value){
          this.buttons[i].classList.remove('btn-DS-Active');
          this.buttons[i].disabled = true;
          break
        }
        // console.log('el botoon es',this.buttons[i].class)
        this.buttons[i].classList.add('btn-DS-Active');
        this.buttons[i].disabled = false;
      }
    }
   }

   async actualizarSaldo(event:any){
    //  const saldo = event.target.parentNode.childNodes[1].childNodes[0].value
     let saldo = event.target.parentNode.childNodes[0].childNodes[1].value
     saldo = saldo.replace(/,/g, '');
     console.log('saldo actualizado',saldo)
     const sesion = localStorage.getItem('sesion');
    const { Datos } = JSON.parse(sesion!)
    
     const response = await fetch( this._http + 'inicio/saldoInicial',{
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        saldo: saldo,
        identificador: event.target.id,
        usuario: Datos
      })
     })
     const datos = await response.json()
     if(datos.Respuesta === 'OK'){
       event.target.parentNode.childNodes[0].childNodes[1].value = '';
       event.target.classList.remove('btn-DS-Active');
       event.target.disabled = true;
       this.getDataInicio()
      }else{
        console.log(datos)
        this._modalMsg.openModalMsg<ModalMsgComponent>( ModalMsgComponent, { data:datos }, false, '300px', 'error' )
       
     }
    //  console.log(datos)
   }

   soloDigito(event:any){
     let valorMonto = event.target.value;
     valorMonto = valorMonto
     .replace(/\D/g, "")
     .replace(/([0-9])([0-9]{2})$/, "$1.$2")
     .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
     
     console.log('evento', valorMonto)
     event.target.value = valorMonto  

   }

  parseDigito(event:any){
    let valorMonto = event.target.value;
    valorMonto = valorMonto
    // .match(/^[0-9,.]{0,50}(?:.[0-9]{0,4}$)*$/g);
    .match(/^[0-9,.]*$/g);
    event.target.value = valorMonto 
    // return formatCurrency(valorMonto, 'en', '$', '','1.2-4')
  }

}
