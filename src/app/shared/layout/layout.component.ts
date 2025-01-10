import { Component } from '@angular/core';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { HeadComponent } from '../head/head.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeadComponent, SidebarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
