import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from '../../../../services/events/events.service';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.css']
})
export class TicketFormComponent implements OnInit {
  @Input() ticket: any = {
    eventId: '',
    type: '',
    price: 0,
    quantity: 0
  };
  @Input() isEditMode: boolean = false;
  events: any[] = [];
  userId = localStorage.getItem('userId') as string

  constructor(
    public activeModal: NgbActiveModal,
    private eventsService: EventsService
  ) {}

  ngOnInit(): void {
    if (!this.isEditMode) { // Only load events if it's a new ticket
      this.eventsService.getEventsForOrganizer(this.userId).subscribe(
        events => this.events = events,
        error => console.error('Error fetching events', error)
      );
    }
  }

  save() {
    this.activeModal.close(this.ticket);
  }
}
