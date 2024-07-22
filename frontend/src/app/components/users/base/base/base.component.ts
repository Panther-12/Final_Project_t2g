import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../../interfaces/interfaces';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent {
  date = new Date().getFullYear()
  currentRoute: string = '';
  pageTitle: string = ''
  user: UserProfile = {
    email: '',
    password: '',
    profile: {
      firstName: '',
      lastName: '',
      bio: '',
      phone: '',
      image: '',
    }
  };

  constructor( private router: Router, private authService: AuthService, private userService: UserService){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        if((this.currentRoute.split("/").reverse()[0].split("#")).length > 0){
            this.pageTitle = this.currentRoute.split("/").reverse()[0].split("#").reverse()[0].replace(/%20/g, ' ')
        }
        else{
          this.pageTitle = this.currentRoute.split("/").reverse()[0]
        }
      }
    });
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(userId).subscribe(profile => {
        this.user = profile;
      });
    }
  }

    // Check if user is logged in
    isLoggedIn(): boolean {
      const userId = localStorage.getItem('userId') as string;
      const token = localStorage.getItem('token') as string;
      return !!userId && !!token;
    }

  logout():void{
    this.authService.logout()
  }
}
