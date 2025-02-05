import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AUTH_URL } from '../utils/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${AUTH_URL}/auth`;
  public currentUser: { role: 'admin' | 'organizer' | 'attendee' } | null = null;
  Admin: boolean = false
  Organizer: boolean = false
  Attendee: boolean = false

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ role: 'admin' | 'organizer' | 'attendee' }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          this.currentUser = { role: response.role }; // Set user role based on response
          localStorage.setItem('tuserId', response.role)
        }),
        map(() => true), // Map to true on successful login
        catchError(() => of(false)) // Return false on error
      );
  }

  getCurrentUser(): Observable<boolean> {
    if(this.currentUser !== null){
      return of(true)
    }
    return of(false);
  }

  isSuperAdmin(): boolean {
    if(this.currentUser?.role as string === 'admin'){
      this.Admin = true
      this.Organizer = false
      this.Attendee = false
      return true
    }
    this.Admin = false
    return false ;
  }

  logout(): void {
    localStorage.removeItem("userId")
    localStorage.removeItem("role")
    localStorage.removeItem("token")
    this.router.navigateByUrl("/users/auth/login")
  }

  isOrganizer(): boolean {
    if(this.currentUser?.role as string === 'organizer'){
      this.Organizer = true
      this.Admin = false
      this.Attendee = false
      return true
    }
    this.Organizer = false
    return false ;
  }

  isAttendee(): boolean {
    if(this.currentUser?.role as string === 'attendee'){
      this.Attendee = true
      this.Admin = false
      this.Organizer = false
      return true
    }
    this.Attendee = false
    return false ;
  }
}
