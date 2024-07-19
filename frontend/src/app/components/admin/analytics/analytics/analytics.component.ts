import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Chart, registerables } from 'chart.js';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Tooltip from 'tooltip.js';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-analytics',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FullCalendarModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  upcomingEvents: any[] = [
    { 
      title: 'Summer Music Festival', 
      date: '2024-07-15',
      time: { from: '3:00 PM', to: '11:00 PM' },
      location: 'Central Park, New York',
      ticketsSold: 150,
      totalAttendees: 174, 
    },
    { 
      title: 'Tech Music Concert', 
      date: '2024-08-05',
      time: { from: '6:00 PM', to: '10:00 PM' },
      location: 'Tech Plaza, Chicago',
      ticketsSold: 120,
      totalAttendees: 145,
    },
    { 
      title: 'BBC Music Concert', 
      date: '2024-09-12',
      time: { from: '7:00 PM', to: '11:30 PM' },
      location: 'BBC Arena, Detroit',
      ticketsSold: 180,
      totalAttendees: 205,
    },
  ];  

  showLoadingSpinner = false;
  calendarOptions!: CalendarOptions;
  addEventForm!: FormGroup;
  showModal = false;
  showCalendarModal = false;

  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;

  constructor(private fb: FormBuilder, private elementRef: ElementRef) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.showLoadingSpinner = true;
    setTimeout(() => {
      this.showLoadingSpinner = false;
      this.initCalendar();
    }, 3000);

    this.addEventForm = this.fb.group({
      title: [''],
      date: [''],
      timeFrom: [''],
      timeTo: [''],
      location: [''],
      ticketsSold: [0],
      totalAttendees: [0]
    });
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderCharts();
    }, 3000);
  }

  renderCharts() {
    const lineChartElement = document.getElementById('lineChart') as HTMLCanvasElement;
    const barChartElement = document.getElementById('barChart') as HTMLCanvasElement;

    if (lineChartElement && barChartElement) {
      new Chart(lineChartElement, {
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

      new Chart(barChartElement, {
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
    } else {
      console.error('Chart elements not found');
    }
  }

  initCalendar() {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      initialDate: new Date().toISOString().split('T')[0],
      plugins: [dayGridPlugin, interactionPlugin],
      dateClick: this.handleDateClick.bind(this),
      events: this.upcomingEvents.map(event => ({
        title: event.title,
        date: event.date,
        extendedProps: {
          time: event.time,
          location: event.location,
          ticketsSold: event.ticketsSold,
          totalAttendees: event.totalAttendees
        }
      })),
      eventContent: this.renderEventContent.bind(this),
      eventDidMount: this.handleEventRender.bind(this),
      dayCellDidMount: this.handleDayCellRender.bind(this)
    };
  }

  handleDateClick(arg: { dateStr: string; }) {
    this.addEventForm.patchValue({ date: arg.dateStr });
    this.showModal = true;
  }

  renderEventContent(eventInfo: any) {
    return { html: '<div class="purple-dot"></div>' };
  }

  openCalendarModal() {
    this.showCalendarModal = true;
    document.body.classList.add('modal-open'); // Prevent scrolling
  }

  closeCalendarModal() {
    this.showCalendarModal = false;
    document.body.classList.remove('modal-open');
  }

  outsideModalClick(event: any) {
    if (event.target.classList.contains('modal') && !event.target.closest('.modal-dialog')) {
      this.closeCalendarModal();
    }
  }
  

  handleEventRender(info: any) {
    const tooltip = new Tooltip(info.el, {
      title: `<strong>${info.event.title}</strong><br>
              Date: ${info.event.start?.toLocaleDateString()}<br>
              Time: ${info.event.extendedProps.time?.from} - ${info.event.extendedProps.time?.to}<br>
              Location: ${info.event.extendedProps.location}<br>
              Tickets Sold: ${info.event.extendedProps.ticketsSold}<br>
              Total Attendees: ${info.event.extendedProps.totalAttendees}`,
      html: true,
      placement: 'top',
      trigger: 'hover',
      container: 'body'
    });
    console.log(tooltip)
  }

  handleDayCellRender(info: any) {
    const currentDate = new Date().toISOString().split('T')[0];
    if (info.date.toISOString().split('T')[0] === currentDate) {
      info.el.style.border = '2px solid #13C296';
      info.el.style.color = '#13C296';
    }
  }

  addEvent() {
    const newEvent = {
      title: this.addEventForm.value.title,
      date: this.addEventForm.value.date,
      time: {
        from: this.addEventForm.value.timeFrom,
        to: this.addEventForm.value.timeTo
      },
      location: this.addEventForm.value.location,
      ticketsSold: this.addEventForm.value.ticketsSold,
      totalAttendees: this.addEventForm.value.totalAttendees
    };
    
    this.upcomingEvents.push(newEvent);
    this.calendarOptions.events = this.upcomingEvents.map(event => ({
      title: event.title,
      date: event.date,
      extendedProps: {
        time: event.time,
        location: event.location,
        ticketsSold: event.ticketsSold,
        totalAttendees: event.totalAttendees
      }
    }));
    
    this.showModal = false;
    this.addEventForm.reset();
  }

}
