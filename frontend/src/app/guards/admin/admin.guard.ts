import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    let isAdmin = localStorage.getItem('role') as string
    if (isAdmin === 'admin' || isAdmin === 'organizer') {
      return true;
    } else {
      this.router.navigateByUrl('/users/auth/login');
      return false;
    }
  }
}