import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = 'http://localhost:3000/events';
  private token = localStorage.getItem('token') as string
  
  private headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  constructor(private http: HttpClient) {}

  createEvent(event: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, event, {
      headers: this.headers
    });
  }

  getAllEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEventById(eventId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${eventId}`);
  }

  updateEvent(eventId: string, event: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${eventId}`, event, {
      headers: this.headers.set('Content-Type', 'application/json')
    });
  }

  cancelEvent(eventId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${eventId}`, {
      headers: this.headers
    });
  }

  getEventsForOrganizer(organizerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/organizer/${organizerId}`, {
      headers: this.headers
    });
  }

  getEventsForUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.headers
    });
  }
}
