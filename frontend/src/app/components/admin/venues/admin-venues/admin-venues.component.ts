import { Component, OnInit } from '@angular/core';
import { VenueService } from '../../../../services/venue/venue.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VenueFormComponent } from '../../venue-form/venue-form/venue-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private venueService: VenueService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadVenues();
  }

  loadVenues(): void {
    this.venueService.getAllVenues().subscribe(
      data => {
        this.venues = data.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
        this.calculateTotalPages(data.length);
      },
      error => {
        console.error('Error loading venues', error);
      }
    );
  }

  openAddVenueModal() {
    this.selectedVenue = {
      name: '',
      address: '',
      capacity: 0,
      type: 'public'
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
          this.loadVenues();
          this.closeModal();
        },
        error => {
          console.error('Error updating venue', error);
        }
      );
    } else {
      this.venueService.createVenue(venue).subscribe(
        newVenue => {
          this.loadVenues();
          this.closeModal();
        },
        error => {
          console.error('Error creating venue', error);
        }
      );
    }
  }

  deleteVenue(venueId: string): void {
    this.venueService.deleteVenue(venueId).subscribe(
      () => {
        this.loadVenues();
      },
      error => {
        console.error('Error deleting venue', error);
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
