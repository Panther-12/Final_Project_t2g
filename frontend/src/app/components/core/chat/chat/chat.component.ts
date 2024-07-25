import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface ChatMessage {
  user: string;
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  userName: string = 'Organizer'; // Adjust based on logged-in user
  attendees: string[] = []; // List of attendees
  activeUsers: string[] = [];

  constructor(private websocketService: ChatService) {}

  ngOnInit(): void {
    this.websocketService.messages.subscribe(msg => {
      this.messages.push({
        user: msg.user,
        message: msg.message,
        timestamp: new Date()
      });
    });

    this.websocketService.activeUsers.subscribe(users => {
      this.activeUsers = users;
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const msg = {
        type: 'chat',
        user: this.userName,
        message: this.newMessage
      };
      this.websocketService.sendMessage(msg);
      this.newMessage = '';
    }
  }

  ngOnDestroy(): void {
    this.websocketService.close();
  }
}
