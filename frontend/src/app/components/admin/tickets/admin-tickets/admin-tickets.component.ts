import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../../../services/loading/loading.service';
import { LoadingComponent } from '../../../utils/loading/loading.component';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [FormsModule, CommonModule, LoadingComponent],
  templateUrl: './admin-tickets.component.html',
  styleUrl: './admin-tickets.component.css'
})
export class AdminTicketsComponent implements OnInit {
  tickets: any;
  loading: boolean = false

  constructor(public loadingService: LoadingService){}

  ngOnInit(): void {
  }
}
