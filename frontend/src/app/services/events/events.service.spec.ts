import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventsService } from './events.service';
import { HttpClient } from '@angular/common/http';

describe('EventsService', () => {
  let service: EventsService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/events';
  const dummyEvent = { id: '1', title: 'Test Event', date: '2024-07-23' };
  const dummyEvents = [dummyEvent];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventsService, HttpClient]
    });

    service = TestBed.inject(EventsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createEvent', () => {
    it('should create an event and return it', () => {
      service.createEvent(dummyEvent).subscribe(event => {
        expect(event).toEqual(dummyEvent);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dummyEvent);
      req.flush(dummyEvent);
    });
  });

  describe('getAllEvents', () => {
    it('should return an array of events', () => {
      service.getAllEvents().subscribe(events => {
        expect(events).toEqual(dummyEvents);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(dummyEvents);
    });
  });

  describe('getEventById', () => {
    it('should return a single event by id', () => {
      const eventId = '1';
      service.getEventById(eventId).subscribe(event => {
        expect(event).toEqual(dummyEvent);
      });

      const req = httpMock.expectOne(`${apiUrl}/${eventId}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyEvent);
    });
  });

  describe('updateEvent', () => {
    it('should update an event and return it', () => {
      const updatedEvent = { ...dummyEvent, title: 'Updated Event' };
      const eventId = '1';

      service.updateEvent(eventId, updatedEvent).subscribe(event => {
        expect(event).toEqual(updatedEvent);
      });

      const req = httpMock.expectOne(`${apiUrl}/${eventId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedEvent);
      req.flush(updatedEvent);
    });
  });

  describe('cancelEvent', () => {
    it('should cancel an event and return a confirmation', () => {
      const eventId = '1';

      service.cancelEvent(eventId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${eventId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getEventsForOrganizer', () => {
    it('should return events for a specific organizer', () => {
      const organizerId = 'org1';

      service.getEventsForOrganizer(organizerId).subscribe(events => {
        expect(events).toEqual(dummyEvents);
      });

      const req = httpMock.expectOne(`${apiUrl}/organizer/${organizerId}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyEvents);
    });
  });

  describe('getEventsForUser', () => {
    it('should return events for a specific user', () => {
      const userId = 'user1';

      service.getEventsForUser(userId).subscribe(events => {
        expect(events).toEqual(dummyEvents);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyEvents);
    });
  });
});
