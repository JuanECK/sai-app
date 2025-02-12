import { Component , } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // _http = process.env["WEBSERVICE_URL"]

  constructor(){
    // console.log('app.component')

      // console.log({message:process.env['WEBSERVICE_URL']})
  }

}
