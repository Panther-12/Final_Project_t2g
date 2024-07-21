import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastNotificationComponent } from './components/utils/toast-notification/toast-notification.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

}
