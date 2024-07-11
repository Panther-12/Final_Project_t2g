import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.css'
})
export class AdminEventsComponent {
  events:  any;
}
