import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:3000/tickets';
  private token = localStorage.getItem('token') as string
  private headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  constructor(private http: HttpClient) {}

  createTicket(ticket: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ticket, {
      headers: this.headers.set('Content-Type', 'application/json')
    });
  }

  getTicketById(ticketId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${ticketId}`, {
      headers: this.headers
    });
  }

  updateTicket(ticketId: string, ticket: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ticketId}`, ticket, {
      headers: this.headers.set('Content-Type', 'application/json')
    });
  }

  deleteTicket(ticketId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${ticketId}`, {
      headers: this.headers
    });
  }

  getAllTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.headers
    });
  }

  getAllTicketsForEvent(eventId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events/${eventId}`, {
      headers: this.headers
    });
  }

  getTicketsForOrganizer(organizerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/organizer/${organizerId}/tickets`, {
      headers: this.headers
    });
  }
}
