import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-attendees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-attendees.component.html',
  styleUrl: './admin-attendees.component.css'
})
export class AdminAttendeesComponent {
  role = 'organizer'; // or 'organizer'

  users = [
    {
      id: '1',
      email: 'admin@example.com',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      status: 'Active'
    },
    {
      id: '2',
      email: 'organizer@example.com',
      role: 'organizer',
      firstName: 'Organizer',
      lastName: 'User',
      status: 'Inactive'
    }
  ];

  events = [
    {
      id: 'e1',
      title: 'Tech Conference',
      description: 'A conference on the latest in tech',
      startDateTime: new Date().toISOString().substring(0, 16),
      endDateTime: new Date().toISOString().substring(0, 16),
      venue: 'Conference Hall A',
      organizer: 'Organizer User'
    }
  ];
  showLoadingSpinner = false

  ngOnInit(): void {
    this.showLoadingSpinner = true
    setTimeout(()=>{
      this.showLoadingSpinner = false
    }, 3000)
  }


  toggleStatus(user: any) {
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
  }
}
