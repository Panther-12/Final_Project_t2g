import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/bookings/bookings.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  userId: string = '';
  userRole: string = '';
  eventFilter: string = '';
  userFilter: string = '';
  ticketTypeFilter: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  cancelledBookings= 0
  pendingBookings = 0
  activeBookings = 0

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') as string;
    this.userRole = localStorage.getItem('role') as string;
    this.loadBookings();
    this.activeBookings  = this.bookings.filter(b => b.status === 'active').length
    this.cancelledBookings = this.bookings.filter(b => b.status === 'cancelled').length
    this.pendingBookings = this.bookings.filter(b => b.status === 'pending').length
  }

  loadBookings(): void {
    if (this.userRole === 'admin') {
      this.bookingService.getAllRegistrations().subscribe(
        data => {
          this.bookings = data;
          this.filteredBookings = data;
          this.applyFilters();
        },
        error => {
          console.error('Error fetching bookings', error);
        }
      );
    } else if (this.userRole === 'organizer') {
      this.bookingService.getAllRegistrationsForOrganizer(this.userId).subscribe(
        data => {
          this.bookings = data;
          this.filteredBookings = data;
          this.applyFilters();
        },
        error => {
          console.error('Error fetching bookings', error);
        }
      );
    }
  }

  applyFilters(): void {
    this.filteredBookings = this.bookings.filter(booking => {
      return (
        (this.eventFilter ? booking.event.title.toLowerCase().includes(this.eventFilter.toLowerCase()) : true) &&
        (this.userRole === 'organizer' && this.userFilter ? booking.user.email.toLowerCase().includes(this.userFilter.toLowerCase()) : true) &&
        (this.userRole === 'organizer' && this.ticketTypeFilter ? booking.tickets.some((ticket: { type: string; }) => ticket.type.toLowerCase().includes(this.ticketTypeFilter.toLowerCase())) : true)
      );
    });
    this.getActiveBookings()
    this.getCancelledBookings()
    this.getActiveBookings()
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelRegistration(bookingId).subscribe(
        () => {
          this.loadBookings();
        },
        error => {
          console.error('Error canceling booking', error);
          alert('Failed to cancel the booking. Please try again.');
        }
      );
    }
  }

  generateReport(): void {
    const doc = new jsPDF();
    const tableColumn = ['Event', 'User', 'Email', 'Ticket Type', 'Price', 'Status', 'Date'];
    const tableRows: any[][] = [];

    this.filteredBookings.forEach(booking => {
      booking.tickets.forEach((ticket: { type: any; price: any; }) => {
        const bookingData = [
          booking.event.title,
          booking.user.profile.firstName,
          booking.user.email,
          ticket.type,
          ticket.price,
          booking.status,
          booking.event.startDateTime
        ];
        tableRows.push(bookingData);
      });
    });

    autoTable(doc, { head: [tableColumn], body: tableRows,  startY: 20 });
    doc.text('Booking Report', 14, 15);
    doc.save('booking_report.pdf');
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  get paginatedBookings(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredBookings.slice(startIndex, startIndex + this.pageSize);
  }

  getActiveBookings(): void{
    this.activeBookings = this.filteredBookings.filter(b => b.status === 'active').length
  }
  getCancelledBookings(): void{
    this.cancelledBookings = this.filteredBookings.filter(b => b.status === 'cancelled').length 
  }
  getPendingBookings(): void{
    this.pendingBookings = this.filteredBookings.filter(b => b.status === 'pending').length
  }
}
