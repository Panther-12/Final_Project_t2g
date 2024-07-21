import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:3000/registration';
  private token = localStorage.getItem('token') as string
  private headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  constructor(private http: HttpClient) {}

  registerUserForEvent(registration: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, registration, {
      headers: this.headers.set('Content-Type', 'application/json')
    });
  }

  getRegistrationById(registrationId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${registrationId}`, {
      headers: this.headers
    });
  }

  updateRegistration(registrationId: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${registrationId}`, { status }, {
      headers: this.headers.set('Content-Type', 'application/json')
    });
  }

  cancelRegistration(registrationId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${registrationId}`, {
      headers: this.headers
    });
  }

  getAllRegistrationsForUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.headers
    });
  }

  getAllRegistrations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.headers
    });
  }

  getAllRegistrationsForOrganizer(organizerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/organizer/${organizerId}`, {
      headers: this.headers
    });
  }
}
