import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket$: WebSocketSubject<any>;
  private wsUrl: string = 'wss://your-websocket-server-url';
  public messages: Subject<any>;
  public activeUsers: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() {
    this.socket$ = webSocket(this.wsUrl);
    this.messages = new Subject<any>();

    this.socket$.subscribe(
      message => {
        if (message.type === 'chat') {
          this.messages.next(message);
        } else if (message.type === 'users') {
          this.activeUsers.next(message.users);
        }
      },
      err => console.error(err),
      () => console.warn('Completed!')
    );
  }

  sendMessage(msg: any) {
    this.socket$.next(msg);
  }

  close() {
    this.socket$.complete();
  }
}
