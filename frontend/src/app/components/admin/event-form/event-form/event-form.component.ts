import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CloudinaryService } from '../../../../services/cloudinary/cloudinary.service';
import { EventsService } from '../../../../services/events/events.service';
import { CategoryService } from '../../../../services/category/category.service';
import { VenueService } from '../../../../services/venue/venue.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  @Input() event: any = {
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    venueId: '',
    organizerId: '',
    categoryId: '',
    images: []
  };

  @Output() saveEvent = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();

  venues: any[] = [];
  categories: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private cloudinaryService: CloudinaryService,
    private eventsService: EventsService,
    private categoryService: CategoryService,
    private venueService: VenueService
  ) {}

  ngOnInit() {
      this.event.organizerId = localStorage.getItem('userId') as string;
      this.loadVenuesAndCategories();
  }

  loadVenuesAndCategories() {
    this.venueService.getAllVenues().subscribe(venues => {
      this.venues = venues;
    });
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onSubmit() {
    if (!this.event.id) {
      const startDateTime = `${this.event.startDate}T${this.event.startTime}:00Z`;
      const endDateTime = `${this.event.endDate}T${this.event.endTime}:00Z`;
      this.event.startDateTime = startDateTime;
      this.event.endDateTime = endDateTime;

      if (this.event.images.length > 0) {
        this.cloudinaryService.uploadFiles(this.event.images).subscribe(uploadResults => {
          this.event.images = uploadResults.map(result => result.secure_url);
          this.saveEvent.emit(this.event);
        });
      } else {
        this.saveEvent.emit(this.event);
      }
    } else {
      this.saveEvent.emit(this.event);
    }
  }

  onImageUpload(event: any) {
    this.event.images = Array.from(event.target.files);
  }

  closeModalForm() {
    this.closeModal.emit();
  }
}
