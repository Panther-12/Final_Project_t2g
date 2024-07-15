import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/login`, { email, password }, this.httpOptions);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users/register`, user, this.httpOptions);
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${userId}`, this.getAuthHeaders());
  }

  updateUser(userId: string, updatedUser: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${userId}`, updatedUser, this.getAuthHeaders());
  }

  deactivateUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`, this.getAuthHeaders());
  }

  reactivateUser(userId: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/users/${userId}/activate`, {}, this.getAuthHeaders());
  }

  updateProfile(userId: string, updatedProfile: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${userId}/profile`, updatedProfile, this.getAuthHeaders());
  }

  assignOrganizerRole(userId: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/users/${userId}/assign-organizer`, {}, this.getAuthHeaders());
  }

  assignAdminRole(userId: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/users/${userId}/assign-admin`, {}, this.getAuthHeaders());
  }

  generateResetCode(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/generate-reset-code`, { email }, this.httpOptions);
  }

  resetPassword(email: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/reset-password`, { email, newPassword }, this.httpOptions);
  }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }
}
