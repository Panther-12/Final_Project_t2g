import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../utils/api';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${BASE_URL}/registration`;
  private token = localStorage.getItem('token') as string

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient) {}

  registerForEvent(eventId: string, userId: string, ticketIds: string[]): Observable<any> {
    const body = { eventId, userId, ticketIds };
    return this.http.post(this.apiUrl, body, this.httpOptions);
  }

  getRegistrationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  updateRegistration(id: string, status: string): Observable<any> {
    const body = { status };
    return this.http.put(`${this.apiUrl}/${id}`, body, this.httpOptions);
  }

  cancelRegistration(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  getAllRegistrationsForUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`, this.httpOptions);
  }

  getAllRegistrations(): Observable<any> {
    return this.http.get(this.apiUrl, this.httpOptions);
  }

  getAllRegistrationsForOrganizer(organizerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/organizer/${organizerId}`, this.httpOptions);
  }
}
