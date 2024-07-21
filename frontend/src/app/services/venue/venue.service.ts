import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  private apiUrl = 'http://localhost:3000/venues';
  private token = localStorage.getItem('token') as string
  private headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  constructor(private http: HttpClient) {}

  createVenue(venue: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, venue, {
      headers: this.headers.set('Content-Type', 'application/json')
    });
  }

  getAllVenues(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getVenueById(venueId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${venueId}`);
  }

  updateVenue(venueId: string, venue: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${venueId}`, venue, {
      headers: this.headers.set('Content-Type', 'application/json')
    });
  }

  deleteVenue(venueId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${venueId}`, {
      headers: this.headers
    });
  }
}
