import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  users: any[] = [];
  currentUser: string = 'Organizer';
  private messagesSubscription!: Subscription;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.messagesSubscription = this.chatService.messages$.subscribe(
      (messages: ChatMessage[]) => {
        this.messages = messages;
      }
    );
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
  }

  loadUsers(): void {
    // Example static data for online users
    this.users = [
      { name: 'Attendee 1', online: true },
      { name: 'Attendee 2', online: false },
      // Add more users
    ];
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message: ChatMessage = {
        sender: this.currentUser,
        content: this.newMessage,
        timestamp: new Date()
      };
      this.chatService.sendMessage(message);
      this.newMessage = '';
    }
  }

  toggleSidebar(): void {
    // Implement sidebar toggle logic if needed
  }
}
