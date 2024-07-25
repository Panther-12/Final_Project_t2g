import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../../../services/loading/loading.service';
import { LoadingComponent } from '../../../utils/loading/loading.component';
import { TicketFormComponent } from '../../ticket-form/ticket-form/ticket-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketService } from '../../../../services/ticket/ticket.service';
import { NotificationService } from '../../../../services/notification/notification.service';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [FormsModule, CommonModule, LoadingComponent, TicketFormComponent],
  templateUrl: './admin-tickets.component.html',
  styleUrls: ['./admin-tickets.component.css']
})
export class AdminTicketsComponent implements OnInit {
  loading: boolean = false;
  role = localStorage.getItem('role') as string;
  tickets: any[] = [];
  paginatedTickets: any[] = [];
  showLoadingSpinner = false;
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;

  constructor(
    public loadingService: LoadingService,
    private modalService: NgbModal,
    private ticketService: TicketService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.showLoadingSpinner = true;
    if (this.role === 'organizer') {
      const organizerId = localStorage.getItem('userId') as string;
      this.ticketService.getTicketsForOrganizer(organizerId).subscribe(
        data => {
          this.tickets = data
          this.calculateTotalPages();
          this.updatePaginatedTickets();
          this.showLoadingSpinner = false;
        },
        error => {
          this.notificationService.notify('Error loading tickets', 'error');
          this.showLoadingSpinner = false;
        }
      );
    } else {
      this.ticketService.getAllTickets().subscribe(
        data => {
          this.tickets = data;
          this.calculateTotalPages();
          this.updatePaginatedTickets();
          this.showLoadingSpinner = false;
        },
        error => {
          this.notificationService.notify('Error loading tickets', 'error');
          this.showLoadingSpinner = false;
        }
      );
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.tickets.length / this.itemsPerPage);
  }

  updatePaginatedTickets(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTickets = this.tickets.slice(startIndex, endIndex);
  }

  getPaginatedTickets(): any[] {
    return this.paginatedTickets;
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedTickets();
    }
  }

  openAddTicketModal(ticket?: any) {
    const modalRef = this.modalService.open(TicketFormComponent);
    modalRef.componentInstance.ticket = ticket ? { ...ticket } : { eventId: '', type: '', price: 0, quantity: 0 };
    modalRef.componentInstance.isEditMode = !!ticket;

    modalRef.result.then(result => {
      if (result) {
        if (ticket) {
          this.updateTicket(result);
        } else {
          this.createTicket(result);
        }
      }
    }).catch(error => {
      this.notificationService.notify('Modal dismissed', 'error');
    });
  }

  createTicket(ticket: any): void {
    this.ticketService.createTicket(ticket).subscribe(
      newTicket => {
        this.tickets.push(newTicket);
        this.calculateTotalPages();
        this.updatePaginatedTickets();
        this.notificationService.notify('Ticket created successfully', 'success')
      },
      error => {
        this.notificationService.notify('Error creating ticket', 'error');
      }
    );
  }

  updateTicket(ticket: any): void {
    this.ticketService.updateTicket(ticket.id, ticket).subscribe(
      updatedTicket => {
        const index = this.tickets.findIndex(t => t.id === ticket.id);
        if (index !== -1) {
          this.tickets[index] = updatedTicket;
        }
        this.calculateTotalPages();
        this.updatePaginatedTickets();
        this.notificationService.notify('Ticket updated successfully', 'success')
      },
      error => {
        this.notificationService.notify('Error updating ticket', 'error');
      }
    );
  }

  deleteTicket(ticketId: string): void {
    this.ticketService.deleteTicket(ticketId).subscribe(
      () => {
        this.tickets = this.tickets.filter(ticket => ticket.id !== ticketId);
        this.calculateTotalPages();
        this.updatePaginatedTickets();
      },
      error => {
        this.notificationService.notify('Error deleting ticket', 'error');
      }
    );
  }
}
