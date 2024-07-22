import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventsService } from '../../../../services/events/events.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

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
  activeTab: string = 'tab_details';

  constructor(private route: ActivatedRoute, private eventService: EventsService,
    private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getAllEvents()
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEventById(eventId).subscribe(data => {
        this.event = data;
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://maps.google.com/maps?q=${encodeURIComponent(data.venue.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
        );
        console.log(this.event)
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
}
