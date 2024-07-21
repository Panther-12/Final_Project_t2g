import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories';
  private token = localStorage.getItem('token') as string
  private headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  constructor(private http: HttpClient) {}

  createCategory(category: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, category, {
      headers: this.headers.set('Content-Type', 'application/json')
    });
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.headers
    });
  }

  getCategoryById(categoryId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${categoryId}`, {
      headers: this.headers
    });
  }

  updateCategory(categoryId: string, category: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${categoryId}`, category, {
      headers: this.headers.set('Content-Type', 'application/json')
    });
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${categoryId}`, {
      headers: this.headers
    });
  }
}
