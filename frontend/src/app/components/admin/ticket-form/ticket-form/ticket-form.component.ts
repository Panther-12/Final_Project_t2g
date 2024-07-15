import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ticket-form.component.html',
  styleUrl: './ticket-form.component.css'
})
export class TicketFormComponent {
  @Input() ticket: any = {
    eventId: '',
    type: '',
    price: 0
  };

  constructor(public activeModal: NgbActiveModal) {}

  save() {
    console.log(this.ticket);
    this.activeModal.close();
  }
}
