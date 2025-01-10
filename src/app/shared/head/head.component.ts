import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-head',
  standalone: true,
  imports: [],
  templateUrl: './head.component.html',
  styleUrl: './head.component.css'
})
export class HeadComponent {

constructor(
  private AuthService: AuthService
){}

salir() {
this.AuthService.logOut()
;}

}
