import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    } else {
      this.router.navigateByUrl('/auth/login');
      return false;
    }
  }
}