import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-attendees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-attendees.component.html',
  styleUrl: './admin-attendees.component.css'
})
export class AdminAttendeesComponent {
  attendees: any;
}
