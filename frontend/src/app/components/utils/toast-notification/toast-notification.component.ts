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

  hideToast(): void {
    this.show = false;
  }

  getIconClass(): string {
    switch (this.type) {
      case 'success':
        return 'fa fa-check-circle animate__animated animate__bounceIn';
      case 'error':
        return 'fa fa-exclamation-circle animate__animated animate__shakeX';
      case 'info':
        return 'fa fa-info-circle animate__animated animate__tada';
      case 'warning':
        return 'fa fa-exclamation-triangle animate__animated animate__swing';
      default:
        return '';
    }
  }
}