import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoadingService } from '../../../../services/loading/loading.service';
import { LoadingComponent } from '../../../utils/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { UserProfile } from '../../../../interfaces/interfaces';
import { NotificationService } from '../../../../services/notification/notification.service';

@Component({
  selector: 'app-admin-base',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoadingComponent, FormsModule, CommonModule],
  templateUrl: './admin-base.component.html',
  styleUrl: './admin-base.component.css'
})
export class AdminBaseComponent implements OnInit {
  loading: boolean = false;
  symbolAt = '@'
  role = localStorage.getItem('role') as string
  user: UserProfile = {
    email: '',
    password: '',
    profile: {
      firstName: '',
      lastName: '',
      bio: '',
      phone: '',
      image: '',
    }
  };

  constructor(public loadingService: LoadingService, private authService: AuthService,
    private userService: UserService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loadingService.showLoading();
    this.loadingService.hideLoadingAfterDelay(3)
    this.loadUserProfile();
  }

  
  loadUserProfile() {
    const userId = localStorage.getItem('userId') as string;
    this.userService.getUserById(userId).subscribe(user => {
      this.user = user;
      this.notificationService.notify(`Welcome back ${this.user.profile.firstName}`, 'info')
    }, error => {
      this.notificationService.notify('Error fetching user profile:', 'error');
    });
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.notify('Logged out successfully', 'success')
  }
}