import { Component } from '@angular/core';
import { BookingService } from '../../../../services/bookings/bookings.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-bookings.component.html',
  styleUrl: './users-bookings.component.css'
})
export class UsersBookingsComponent {
  bookings: any[] = [];
  displayedBookings: any[] = [];
  userId: string = '';
  currentIndex: number = 0;
  increment: number = 3;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') as string;
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getAllRegistrationsForUser(this.userId).subscribe(
      data => {
        this.bookings = data;
        this.displayedBookings = this.bookings.slice(0, this.increment);
        this.currentIndex = this.increment;
      },
      error => {
        console.error('Error fetching bookings', error);
      }
    );
  }

  loadMore(): void {
    const nextIndex = this.currentIndex + this.increment;
    this.displayedBookings = [...this.displayedBookings, ...this.bookings.slice(this.currentIndex, nextIndex)];
    this.currentIndex = nextIndex;
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelRegistration(bookingId).subscribe(
        () => {
          this.bookings = this.bookings.filter(booking => booking.id !== bookingId);
          this.displayedBookings = this.displayedBookings.filter(booking => booking.id !== bookingId);
        },
        error => {
          console.error('Error canceling booking', error);
          alert('Failed to cancel the booking. Please try again.');
        }
      );
    }
  }
}
