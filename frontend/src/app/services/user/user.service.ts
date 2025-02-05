import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { updateProfile, User, UserProfile } from '../../interfaces/interfaces';
import { BASE_URL } from '../utils/api';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${BASE_URL}`;
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

  getUserById(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/users/${userId}`, this.getAuthHeaders());
  }

  getAllUsers(){
    return this.http.get<any[]>(`${this.baseUrl}/users/all`, this.getAuthHeaders());
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

  updateProfile(userId: string, updatedProfile: updateProfile): Observable<updateProfile> {
    return this.http.put<updateProfile>(`${this.baseUrl}/users/${userId}/profile`, updatedProfile, this.getAuthHeaders());
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

  resetPassword(email: string, resetCode: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/reset-password`, { email, resetCode, newPassword }, this.httpOptions);
  }

  getAttendeesForOrganizerEvents(organizerId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/organizer/${organizerId}/attendees`, this.getAuthHeaders());
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
