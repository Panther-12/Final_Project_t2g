// src/app/services/chat/chat.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: WebSocketSubject<any>;
  private messagesSubject = new BehaviorSubject<any[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.socket = webSocket('ws://http://localhost:4000');
    this.socket.subscribe(
      message => this.messagesSubject.next([...this.messagesSubject.getValue(), message]),
      err => console.error('WebSocket error: ', err),
      () => console.log('WebSocket connection closed')
    );
  }

  getSocket(): WebSocketSubject<any> {
    return this.socket;
  }

  sendMessage(message: any): void {
    this.socket.next(message);
  }
}
