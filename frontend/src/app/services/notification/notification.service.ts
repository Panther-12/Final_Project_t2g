import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<{ message: string, type: string }>();

  notify(message: string, type: string = 'info') {
    this.notificationSubject.next({ message, type });
  }

  getNotification(): Observable<{ message: string, type: string }> {
    return this.notificationSubject.asObservable();
  }
}