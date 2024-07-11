import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent {
  @Input() event: any = {
    name: '',
    date: '',
    location: '',
    description: '',
    image: ''
  };

  @Output() saveEvent = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();

  onSubmit() {
    this.saveEvent.emit(this.event);
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.event.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
