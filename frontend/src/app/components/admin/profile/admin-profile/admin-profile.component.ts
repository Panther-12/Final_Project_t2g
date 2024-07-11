import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {
  user = {
    name: 'Nimrod Nyongesa',
    email: 'nimrod@tailgrids.com',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    location: 'Nairobi, Kenya',
    profileImage: 'https://via.placeholder.com/150'
  };

  editMode = false;

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveProfile() {
    // Here you can handle saving the profile data, e.g., sending it to a backend service
    this.toggleEditMode();
  }

  uploadProfileImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
