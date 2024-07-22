import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { updateProfile, UserProfile } from '../../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CloudinaryService } from '../../../../services/cloudinary/cloudinary.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
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


  constructor(private userService: UserService, private cloudinaryService: CloudinaryService) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(userId).subscribe(profile => {
        this.user = profile;
      });
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.cloudinaryService.uploadFile(file).subscribe( result =>{
        this.user.profile.image = result.secure_url
      })
    }
  }

  updateProfile(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const updatedProfile = {
        firstName: this.user.profile.firstName,
        lastName: this.user.profile.lastName,
        bio: this.user.profile.bio,
        phone: this.user.profile.phone,
        image: this.user.profile.image,
      };
      this.userService.updateProfile(userId, updatedProfile).subscribe(
        response => {
          console.log('Profile updated successfully', response);
        },
        error => {
          console.error('Error updating profile', error);
        }
      );
    }
  }
}
