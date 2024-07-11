import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  standalone: true,
  selector: 'app-analytics',
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  upcomingEvents: any[] = [
    { 
      title: 'Summer Music Festival', 
      date: 'July 15, 2024',
      time: { from: '3:00 PM', to: '11:00 PM' },
      location: 'Central Park, New york',
      ticketsSold: 150,
      totalAttendees: 174, 
    },
    { 
      title: 'Tech Music Concert', 
      date: 'August 5, 2024',
      time: { from: '6:00 PM', to: '10:00 PM' },
      location: 'Tech Plaza, Chicago',
      ticketsSold: 120,
      totalAttendees: 145,
    },
    { 
      title: 'BBC Music Concert', 
      date: 'September 12, 2024',
      time: { from: '7:00 PM', to: '11:30 PM' },
      location: 'BBC Arena, Detroit',
      ticketsSold: 180,
      totalAttendees: 205,
    },
  ];  
  calendarOptions!: CalendarOptions;
  constructor() {
    Chart.register(...registerables);
  }


  ngOnInit() {
    this.renderCharts();
    this.initCalendar();
  }

  renderCharts() {
    new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
          {
            label: 'Revenue',
            data: [1200, 1900, 3000, 5000, 2000, 3000, 4500, 6000],
            borderColor: '#6f42c1',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.3
          },
          {
            label: 'Expenses',
            data: [900, 1500, 2500, 4000, 2300, 2800, 4200, 5500],
            borderColor: '#13C296', 
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.3,
          },
        ],
      },
    });

    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Amapiano', 'Afro pop', 'Soul Music', 'Electro Pop', 'Other'],
        datasets: [
          {
            label: 'Sales',
            data: [65, 59, 80, 81, 56],
            backgroundColor: '#6f42c1',
          },
        ],
      },
    });
  }

  initCalendar() {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      dateClick: this.handleDateClick.bind(this),
      events: this.upcomingEvents.map(event => ({
        title: event.title,
        date: event.date
      })),
      eventDidMount: this.handleEventRender.bind(this)
    };
  }

  handleDateClick(arg: { dateStr: string; }) {
    console.log('date click! ' + arg.dateStr);
  }

  handleEventRender(info: any) {
    // Custom event rendering logic if needed
  }
}
