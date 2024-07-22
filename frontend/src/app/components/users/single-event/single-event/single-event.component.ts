import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventsService } from '../../../../services/events/events.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../../services/bookings/bookings.service';

@Component({
  selector: 'app-single-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.css']
})
export class SingleEventComponent implements OnInit {
  symbolAt = '@';
  event: any;
  events: any[] = [];
  allEvents: any[] = [];
  mapUrl: SafeResourceUrl | undefined;
  userId: string = localStorage.getItem('userId') as string;
  token: string = localStorage.getItem('token') as string
  activeTab: string = 'tab_details';
  selectedTickets: { [ticketId: string]: number } = {};

  constructor(private route: ActivatedRoute, private eventService: EventsService,
    private sanitizer: DomSanitizer, private router: Router,private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getAllEvents();
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEventById(eventId).subscribe(data => {
        this.event = data;
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://maps.google.com/maps?q=${encodeURIComponent(data.venue.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
        );
        this.updateUrlWithEventName(data.title);
        console.log(this.event);
      });
    }
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
    });
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  private updateUrlWithEventName(eventTitle: string): void {
    // Assuming you want to replace the URL segment with the event name
    const newUrl = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      fragment: eventTitle
    });
    this.router.navigateByUrl(newUrl.toString(), { replaceUrl: true });
  }

  handleTicketChange(ticketId: string, quantity: number): void {
    quantity = Math.max(quantity,0)
    if (quantity > 0) {
      this.selectedTickets[ticketId] = quantity;
    } else {
      delete this.selectedTickets[ticketId];
    }
  }

  registerForEvent(): void {
    if (!this.userId || !this.token) {
      this.router.navigateByUrl('/users/auth/login')
      return;
    }
    const ticketIds = Object.keys(this.selectedTickets);
    if (this.event && this.userId && ticketIds.length > 0) {
      const ticketIdsArray = ticketIds.flatMap(ticketId => Array(this.selectedTickets[ticketId]).fill(ticketId));
      this.bookingService.registerForEvent(this.event.id, this.userId, ticketIdsArray).subscribe(response => {
        console.log('Registration successful', response);
      }, error => {
        console.error('Registration failed', error);
      });
    } else {
      console.error('Missing required data for registration');
    }
  }
}
