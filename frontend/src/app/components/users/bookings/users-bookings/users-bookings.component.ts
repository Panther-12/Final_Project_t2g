import { Component } from '@angular/core';
import { BookingService } from '../../../../services/bookings/bookings.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../services/notification/notification.service';
import { ConfirmationDialogComponent } from '../../../utils/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-users-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationDialogComponent],
  templateUrl: './users-bookings.component.html',
  styleUrl: './users-bookings.component.css'
})
export class UsersBookingsComponent {
  bookings: any[] = [];
  displayedBookings: any[] = [];
  userId: string = '';
  currentIndex: number = 0;
  increment: number = 3;
  showDialog = false;
  dialogMessage = '';
  dialogType: 'success' | 'error' | 'info' | 'warning' = 'info';
  bookingIdToCancel: string = '';

  constructor(private bookingService: BookingService, private notificationService: NotificationService) {}

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
        this.notificationService.notify('Error fetching bookings', 'error');
      }
    );
  }

  loadMore(): void {
    const nextIndex = this.currentIndex + this.increment;
    this.displayedBookings = [...this.displayedBookings, ...this.bookings.slice(this.currentIndex, nextIndex)];
    this.currentIndex = nextIndex;
  }

  cancelBooking(bookingId: string): void {
    this.showConfirmationDialog('Are you sure you want to cancel this booking?', 'warning', bookingId);
  }


  showConfirmationDialog(message: string, type: 'success' | 'error' | 'info' | 'warning', bookingId: string): void {
    this.dialogMessage = message;
    this.dialogType = type;
    this.bookingIdToCancel = bookingId;
    this.showDialog = true;
  }

  handleDialogConfirmation(confirmed: boolean): void {
    if (confirmed && this.bookingIdToCancel) {
      this.bookingService.cancelRegistration(this.bookingIdToCancel).subscribe(
        () => {
          this.loadBookings();
        },
        error => {
          this.notificationService.notify('Failed to cancel the booking. Please try again.', 'error');
        }
      );
    }
    this.showDialog = false;
  }
}
