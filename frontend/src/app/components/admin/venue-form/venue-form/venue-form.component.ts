import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-venue-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './venue-form.component.html',
  styleUrls: ['./venue-form.component.css']
})
export class VenueFormComponent {
  @Input() venue: any = {};
  @Output() saveVenue = new EventEmitter<any>();
  
  constructor(public activeModal: NgbActiveModal) {}

  save() {
    this.saveVenue.emit(this.venue);
    this.activeModal.close();
  }
}
