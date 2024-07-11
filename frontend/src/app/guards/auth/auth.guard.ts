import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRole = route.data['role'];
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || currentUser.role !== requiredRole) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
