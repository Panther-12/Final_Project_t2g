import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventFormComponent } from '../../event-form/event-form/event-form.component';
import { EventsService } from '../../../../services/events/events.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [FormsModule, CommonModule, EventFormComponent],
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.css']
})
export class AdminEventsComponent implements OnInit {
  analytics = [
    { name: 'Amapiano', value: 75, description: 'Maecenas id ultrices' },
    { name: 'Afro pop', value: 83, description: 'Sancenas dultrices' },
    { name: 'Soul ', value: 25, description: 'Maecenas id ultrices' },
    { name: 'Other', value: 82, description: 'Sancenas dultrices' },
  ];

  events: any[] = [];
  paginatedEvents: any[] = [];
  selectedEvent: any = null;
  showLoadingSpinner = false;
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;
  role = localStorage.getItem('role') as string

  constructor(private eventService: EventsService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.showLoadingSpinner = true;
    this.eventService.getAllEvents().subscribe(
      data => {
        this.events = data.map(event => ({
          ...event,
          duration: this.calculateDuration(event.startDateTime, event.endDateTime)
        }));
        this.calculateTotalPages();
        this.updatePaginatedEvents();
        this.showLoadingSpinner = false;
      },
      error => {
        console.error('Error loading events', error);
        this.showLoadingSpinner = false;
      }
    );
  }

  calculateDuration(startDateTime: string, endDateTime: string): string {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs} hrs ${diffMins} mins`;
  }

  openAddEventModal() {
    this.selectedEvent = {
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      venueId: '',
      organizerId: '',
      categoryId: '',
      images: []
    };
    const modalRef = this.modalService.open(EventFormComponent);
    modalRef.componentInstance.event = this.selectedEvent;
    modalRef.componentInstance.saveEvent.subscribe((event: any) => this.handleSaveEvent(event));
  }

  openEditEventModal(event: any) {
    const [startDate, startTime] = event.startDateTime.split('T');
    const [endDate, endTime] = event.endDateTime.split('T');

    this.selectedEvent = {
      ...event,
      startDate,
      startTime,
      endDate,
      endTime,
    };
    const modalRef = this.modalService.open(EventFormComponent);
    modalRef.componentInstance.event = this.selectedEvent;
    modalRef.componentInstance.saveEvent.subscribe((event: any) => this.handleSaveEvent(event));
  }

  handleSaveEvent(event: any) {
    if (event.id) {
      this.eventService.updateEvent(event.id, event).subscribe(
        updatedEvent => {
          this.events = this.events.map(e => (e.id === updatedEvent.id ? updatedEvent : e));
          this.calculateTotalPages();
          this.updatePaginatedEvents();
          this.closeModal();
        },
        error => {
          console.error('Error updating event', error);
        }
      );
    } else {
      console.log(event)
      this.eventService.createEvent(event).subscribe(
        newEvent => {
          this.events.push(newEvent);
          this.calculateTotalPages();
          this.updatePaginatedEvents();
          this.closeModal();
        },
        error => {
          console.error('Error creating event', error);
        }
      );
    }
  }

  deleteEvent(eventId: string): void {
    this.eventService.cancelEvent(eventId).subscribe(
      () => {
        this.events = this.events.filter(event => event.id !== eventId);
        this.calculateTotalPages();
        this.updatePaginatedEvents();
      },
      error => {
        console.error('Error deleting event', error);
      }
    );
  }

  closeModal() {
    this.selectedEvent = null;
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.events.length / this.itemsPerPage);
  }

  updatePaginatedEvents(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.events.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedEvents();
    }
  }
}
