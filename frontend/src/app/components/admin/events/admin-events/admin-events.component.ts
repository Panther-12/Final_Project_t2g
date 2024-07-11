import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventFormComponent } from '../../event-form/event-form/event-form.component';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [FormsModule, CommonModule, EventFormComponent],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.css'
})
export class AdminEventsComponent {
  analytics = [
    { name: 'Amapiano', value: 75, description: 'Maecenas id ultrices' },
    { name: 'Afro pop', value: 83, description: 'Sancenas dultrices' },
    { name: 'Soul ', value: 25, description: 'Maecenas id ultrices' },
    { name: 'Other', value: 82, description: 'Sancenas dultrices' },
  ];

  events = [
    { id: 'rt43', name: 'Tech Conference', duration: '2 Days', description: 'A conference on the latest in tech', location: 'New York, NY', price: '$150.00' },
    { id: '53y5445', name: 'Health Expo', duration: '3 Days', description: 'A comprehensive health and wellness expo', location: 'Los Angeles, CA', price: '$200.00' },
    { id: '4u353', name: 'Art Workshop', duration: '1 Day', description: 'A hands-on workshop on modern art techniques', location: 'San Francisco, CA', price: '$75.00' },
    { id: '35y35', name: 'Startup Summit', duration: '2 Days', description: 'A summit for aspiring entrepreneurs and startups', location: 'Austin, TX', price: '$180.00' },
    { id: '35y34', name: 'Music Festival', duration: '3 Days', description: 'A festival featuring various musical acts', location: 'Chicago, IL', price: '$250.00' },
    { id: '35y3', name: 'Food Fair', duration: '1 Day', description: 'A fair showcasing diverse cuisines and food vendors', location: 'Miami, FL', price: '$50.00' },
  ];
  

  selectedEvent: any = null;

  openAddEventModal() {
    this.selectedEvent = {
      id: '',
      name: '',
      date: '',
      location: '',
      description: '',
      image: ''
    };
  }

  openEditEventModal(event: any) {
    this.selectedEvent = { ...event };
  }

  saveEvent(event: any) {
    if (event.id) {
      const index = this.events.findIndex(e => e.id === event.id);
      this.events[index] = event;
    } else {
      event.id = new Date().getTime();
      this.events.push(event);
    }
    this.selectedEvent = null;
  }

  closeModal() {
    this.selectedEvent = null;
  }
}
