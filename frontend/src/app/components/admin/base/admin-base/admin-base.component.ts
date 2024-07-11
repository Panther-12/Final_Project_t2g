import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoadingService } from '../../../../services/loading/loading.service';
import { LoadingComponent } from '../../../utils/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-base',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoadingComponent, FormsModule, CommonModule],
  templateUrl: './admin-base.component.html',
  styleUrl: './admin-base.component.css'
})
export class AdminBaseComponent implements OnInit {
  loading: boolean = false;
  symbolAt = '@'

  constructor(public loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.loadingService.showLoading();
    this.loadingService.hideLoadingAfterDelay(3)
  }
}