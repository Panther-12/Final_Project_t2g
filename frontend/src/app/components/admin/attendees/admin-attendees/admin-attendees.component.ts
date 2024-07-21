import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user/user.service';
import { EventsService } from '../../../../services/events/events.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../../../../interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
  selector: 'app-admin-attendees',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-attendees.component.html',
  styleUrls: ['./admin-attendees.component.css'],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class AdminAttendeesComponent implements OnInit {
  role = localStorage.getItem('role') as string;
  userId = localStorage.getItem('userId') as string;
  users: any[] = [];
  selectedUser: any = null;
  events: any[] = [];
  showLoadingSpinner = false;
  filteredUsers: any[] = [];
  filters = ['All', 'Organizer', 'User'];
  selectedFilter = 'All';
  selectedEvent = 'All';
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;

  constructor(private userService: UserService, private eventService: EventsService) {}

  ngOnInit(): void {
    this.showLoadingSpinner = true;
    if (this.role === 'organizer') {
      this.eventService.getEventsForOrganizer(this.userId).subscribe(events => {
        this.events = events;
      });

      this.userService.getAttendeesForOrganizerEvents(this.userId).subscribe(users => {
        this.users = users;
        this.filteredUsers = users;
        this.calculateTotalPages();
        this.showLoadingSpinner = false;
      }, error => {
        console.error('Error fetching users', error);
        this.showLoadingSpinner = false;
      });
    } else {
      this.userService.getAllUsers().subscribe(users => {
        this.users = users;
        this.filteredUsers = users;
        this.calculateTotalPages();
        this.showLoadingSpinner = false;
      }, error => {
        console.error('Error fetching users', error);
        this.showLoadingSpinner = false;
      });
    }
  }

  filterUsers(filter: string) {
    this.selectedFilter = filter;
    this.currentPage = 1;
    this.applyFilters();
  }

  filterUsersByEvent(eventId: string) {
    this.selectedEvent = eventId;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let filteredUsers = this.users;

    if (this.selectedFilter !== 'All') {
      filteredUsers = filteredUsers.filter(user => user.role === this.selectedFilter.toLowerCase());
    }

    if (this.selectedEvent !== 'All') {
      filteredUsers = filteredUsers.filter(user =>
        user.registrations.some((registration: { eventId: string; }) => registration.eventId === this.selectedEvent)
      );
    }
    this.filteredUsers = filteredUsers;
    this.calculateTotalPages();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  getPaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  onUserRowClick(user: any) {
    this.selectedUser = user;
    if (user.role === 'organizer') {
      this.eventService.getEventsForOrganizer(user.id).subscribe(events => {
        this.events = events;
      }, error => {
        console.error('Error fetching events for organizer', error);
      });
    } else if (user.role === 'user') {
      this.eventService.getEventsForUser(user.id).subscribe(events => {
        this.events = events;
      }, error => {
        console.error('Error fetching events for user', error);
      });
    } else {
      this.events = [];
    }
  }

  toggleStatus(user: any) {
    if (user.accountStatus === 'activated') {
      this.userService.deactivateUser(user.id).subscribe(() => {
        user.accountStatus = 'deactivated';
      }, error => {
        console.error('Error deactivating user', error);
      });
    } else {
      this.userService.reactivateUser(user.id).subscribe(() => {
        user.accountStatus = 'activated';
      }, error => {
        console.error('Error activating user', error);
      });
    }
  }
}
