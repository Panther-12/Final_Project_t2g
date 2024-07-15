import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../../../services/loading/loading.service';
import { LoadingComponent } from '../../../utils/loading/loading.component';
import { TicketFormComponent } from '../../ticket-form/ticket-form/ticket-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [FormsModule, CommonModule, LoadingComponent,TicketFormComponent],
  templateUrl: './admin-tickets.component.html',
  styleUrl: './admin-tickets.component.css'
})
export class AdminTicketsComponent implements OnInit {
  loading: boolean = false
  role = 'organizer'; // or 'organizer'
  tickets = [
    { id: 't1', eventId: 'e1', type: 'General Admission', price: 50.00 },
    { id: 't2', eventId: 'e1', type: 'VIP', price: 100.00 }
  ];

  constructor(public loadingService: LoadingService, private modalService: NgbModal){}

  showLoadingSpinner = false

  ngOnInit(): void {
    this.showLoadingSpinner = true
    setTimeout(()=>{
      this.showLoadingSpinner = false
    }, 3000)
  }

  openAddTicketModal(ticket?: any) {
    const modalRef = this.modalService.open(TicketFormComponent);
    if (ticket) {
      modalRef.componentInstance.ticket = ticket;
    }
  }

  deleteTicket(ticketId: string) {
    this.tickets = this.tickets.filter(ticket => ticket.id !== ticketId);
  }
}
