import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EventsService } from '../../../../services/events/events.service';
import { NotificationService } from '../../../../services/notification/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  symbolAt = '@';
  events: any[] = [];
  allEvents: any[] = [];
  page: number = 0;
  size: number = 4;
  userId: string = localStorage.getItem('userId') as string
  token: string = localStorage.getItem('token') as string

  searchDate: string = '';
  searchEvent: string = '';
  searchLocation: string = '';

  constructor(private eventService: EventsService, private notificationService: NotificationService, private router: Router) {}

  ngOnInit(): void {
    this.getAllEvents();
  }

  getAllEvents(): void {
    this.eventService.getAllEvents().subscribe(data => {
      this.allEvents = data.map(event => {
        let minPrice = 0;
        if (event.tickets && event.tickets.length > 0) {
          minPrice = Math.min(...event.tickets.map((ticket: { price: any; }) => ticket.price));
        }
        return {
          ...event,
          minPrice: minPrice
        };
      });
      this.loadMore();
    });
  }

  loadMore(): void {
    const nextEvents = this.allEvents.slice(this.page * this.size, (this.page + 1) * this.size);
    this.events = [...this.events, ...nextEvents];
    this.page++;
  }

  searchEvents(): void {
    this.page = 0;
    const filteredEvents = this.allEvents.filter(event => {
      const matchesDate = this.searchDate ? event.startDateTime.startsWith(this.searchDate) : true;
      const matchesEvent = this.searchEvent ? event.title.toLowerCase().includes(this.searchEvent.toLowerCase()) : true;
      const matchesLocation = this.searchLocation ? event.venue.address.toLowerCase().includes(this.searchLocation.toLowerCase()) : true;
      return matchesDate && matchesEvent && matchesLocation;
    });
    this.events = [];
    this.allEvents = filteredEvents;
    this.loadMore();
  }

  onSearch(): void {
    this.getAllEvents();
    this.searchEvents();
  }

  navigateToEvent(eventId: string): void {
    this.router.navigateByUrl(`/users/event/${eventId}`);
  }
}
