import { Component, OnInit } from '@angular/core';
import { VenueService } from '../../../../services/venue/venue.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VenueFormComponent } from '../../venue-form/venue-form/venue-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../services/notification/notification.service';

@Component({
  selector: 'app-admin-venues',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-venues.component.html',
  styleUrls: ['./admin-venues.component.css']
})
export class AdminVenuesComponent implements OnInit {
  venues: any[] = [];
  selectedVenue: any = null;
  showLoadingSpinner = false;
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;
  role: string = ''
  userVenues: any[] = []

  constructor(private venueService: VenueService, private modalService: NgbModal, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string
    this.loadVenues();
  }

  loadVenues(): void {
    this.venueService.getAllVenues().subscribe(
      data => {
        if(this.role === 'organizer'){
          this.userVenues = data.filter(venue => venue.type === 'public')
        }
        else{
          this.userVenues = data
        }
        this.venues = this.userVenues.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
        this.calculateTotalPages(data.length);
      },
      error => {
        this.notificationService.notify('Error loading venues', 'error');
      }
    );
  }

  openAddVenueModal() {
    this.selectedVenue = {
      name: '',
      address: '',
      capacity: 0,
      type: ''
    };
    const modalRef = this.modalService.open(VenueFormComponent);
    modalRef.componentInstance.venue = this.selectedVenue;
    modalRef.componentInstance.saveVenue.subscribe((venue: any) => this.handleSaveVenue(venue));
  }

  openEditVenueModal(venue: any) {
    this.selectedVenue = { ...venue };
    const modalRef = this.modalService.open(VenueFormComponent);
    modalRef.componentInstance.venue = this.selectedVenue;
    modalRef.componentInstance.saveVenue.subscribe((venue: any) => this.handleSaveVenue(venue));
  }

  handleSaveVenue(venue: any) {
    if (venue.id) {
      this.venueService.updateVenue(venue.id, venue).subscribe(
        updatedVenue => {
          this.notificationService.notify('Event updated successfully', 'success')
          this.loadVenues();
          this.closeModal();
        },
        error => {
          this.notificationService.notify('Error updating venue', 'error');
        }
      );
    } else {
      this.venueService.createVenue(venue).subscribe(
        newVenue => {
          this.notificationService.notify('Event created successfully', 'success')
          this.loadVenues();
          this.closeModal();
        },
        error => {
          this.notificationService.notify('Error creating venue', 'error');
        }
      );
    }
  }

  deleteVenue(venueId: string): void {
    this.venueService.deleteVenue(venueId).subscribe(
      () => {
        this.notificationService.notify('Event deleted successfully', 'success')
        this.loadVenues();
      },
      error => {
        this.notificationService.notify('Error deleting venue', 'error');
      }
    );
  }

  closeModal() {
    this.selectedVenue = null;
  }

  calculateTotalPages(totalItems: number): void {
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadVenues();
    }
  }
}
