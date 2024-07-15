import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.scss'
})
export class ToastNotificationComponent implements OnInit {
  message: string = '';
  type: string = ''; // 'success', 'error', 'info', etc.
  show: boolean = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getNotification().subscribe(notification => {
      this.message = notification.message;
      this.type = notification.type;
      this.show = true;

      setTimeout(() => {
        this.show = false;
      }, 3000);
    });
  }
}