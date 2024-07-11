import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudinaryUrl = 'https://api.cloudinary.com/v1_1/duk34ipre/image/upload';
  private uploadPreset = 'shopie';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    return this.http.post(this.cloudinaryUrl, formData);
  }

  uploadFiles(files: File[]): Observable<any[]> {
    const uploadRequests = files.map(file => this.uploadFile(file));
    return forkJoin(uploadRequests);
  }
}
