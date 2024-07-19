import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUser: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): boolean {
    // Simulate API call and login
    let user = this.http.post(`${this.apiUrl}/login`, {email, password});
    if (email === 'admin@example.com' && password === 'password') {
      this.currentUser = { role: 'SUPER_ADMIN' };
      return true;
    }
    if (email === 'organizer@example.com' && password === 'password') {
      this.currentUser = { role: 'ORGANIZER' };
      return true;
    }
    if (email === 'attendee@example.com' && password === 'password') {
      this.currentUser = { role: 'ATTENDEE' };
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem("userId")
    localStorage.removeItem("role")
    localStorage.removeItem("token")
    this.router.navigateByUrl("/users/auth/login")
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  isSuperAdmin(): boolean {
    return this.currentUser?.role === 'SUPER_ADMIN';
  }

  isOrganizer(): boolean {
    return this.currentUser?.role === 'ORGANIZER';
  }

  isAttendee(): boolean {
    return this.currentUser?.role === 'ATTENDEE';
  }
}