import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CloudinaryService } from '../../../../services/cloudinary/cloudinary.service';
import { UserService } from '../../../../services/user/user.service';
import { Observable } from 'rxjs';
import { User, UserProfile } from '../../../../interfaces/interfaces';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})


export class AdminProfileComponent implements OnInit {
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

  editMode = false;
  showLoadingSpinner = false;
  selectedFile!: File;
  location: string = ''

  constructor(
    private cloudinaryService: CloudinaryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.getLocation();
  }

  loadUserProfile() {
      const userId = localStorage.getItem('userId') as string;
      this.userService.getUserById(userId).subscribe(user => {
        this.user = user;
      }, error => {
        console.error('Error fetching user profile:', error);
      });
    }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.showLoadingSpinner = true;
      setTimeout(() => {
        this.showLoadingSpinner = false;
      }, 3000);
    }
  }

  saveProfile() {
    if (this.selectedFile) {
      console.log(this.selectedFile)
      this.uploadProfileImage(this.selectedFile).subscribe(result => {
        this.user.profile.image = result.secure_url;
        this.updateUserProfile();
        this.loadUserProfile();
      });
    } else {
      this.updateUserProfile();
    }
  }

  uploadProfileImage(file:File): Observable<any> {
    return this.cloudinaryService.uploadFile(this.selectedFile);
  }

  updateUserProfile() {
    const token = localStorage.getItem('token');
    if (token) {
      const userId = localStorage.getItem('userId') as string
      const updatedProfile = {
        firstName: this.user.profile.firstName,
        lastName: this.user.profile.lastName,
        bio: this.user.profile.bio,
        phone: this.user.profile.phone,
        image: this.user.profile.image,
      };

      this.userService.updateProfile(userId, updatedProfile).subscribe(() => {
        this.toggleEditMode();
      }, error => {
        console.error('Error updating profile:', error);
      });
    }
  }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profile.image = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.location = `${position.coords.latitude},${position.coords.longitude}`;
      }, error => {
        console.error('Error getting location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
}