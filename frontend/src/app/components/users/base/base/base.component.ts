import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent {
  date = new Date().getFullYear()
  currentRoute: string = '';
  pageTitle: string = ''

  constructor( private router: Router){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        this.pageTitle = this.currentRoute.split("/").reverse()[0]
      }
    });
  }
}
