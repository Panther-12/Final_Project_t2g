import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookingService } from './bookings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/registration';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMjJlNTQwMC0xZWY0LTQ0NTctOTFiOC0wOTUwYzZiYTZhZmQiLCJpYXQiOjE3MjE2ODIxNDUsImV4cCI6MTcyMTY4NTc0NX0.fRMv1dqqSqdC_6ha1XbkPHWbrJKC33aljk2fxsj-17A';
  localStorage.setItem('token', token)

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingService, HttpClient]
    });

    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock token in localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'token') return token;
      return null;
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registerForEvent', () => {
    it('should register for an event and return success', () => {
      const eventId = 'event123';
      const userId = 'user123';
      const ticketIds = ['ticket1', 'ticket2'];
      const response = { success: true };

      service.registerForEvent(eventId, userId, ticketIds).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne({
        method: 'POST',
        url: apiUrl
      });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.body).toEqual({ eventId, userId, ticketIds });
      req.flush(response);
    });

    it('should handle error during registration', () => {
      const eventId = 'event123';
      const userId = 'user123';
      const ticketIds = ['ticket1', 'ticket2'];
      const errorMessage = 'Error registering for event';

      service.registerForEvent(eventId, userId, ticketIds).subscribe({
        next: () => fail('should have failed with a 500 status'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne({
        method: 'POST',
        url: apiUrl
      });
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getRegistrationById', () => {
    it('should get registration by id', () => {
      const registrationId = 'reg123';
      const response = { id: registrationId, userId: 'user123', eventId: 'event123' };

      service.getRegistrationById(registrationId).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: `${apiUrl}/${registrationId}`
      });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush(response);
    });

    it('should handle error during fetching registration', () => {
      const registrationId = 'reg123';
      const errorMessage = 'Error fetching registration';

      service.getRegistrationById(registrationId).subscribe({
        next: () => fail('should have failed with a 404 status'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: `${apiUrl}/${registrationId}`
      });
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateRegistration', () => {
    it('should update registration status and return success', () => {
      const registrationId = 'reg123';
      const status = 'active';
      const response = { success: true };

      service.updateRegistration(registrationId, status).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne({
        method: 'PUT',
        url: `${apiUrl}/${registrationId}`
      });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.body).toEqual({ status });
      req.flush(response);
    });

    it('should handle error during updating registration', () => {
      const registrationId = 'reg123';
      const status = 'active';
      const errorMessage = 'Error updating registration';

      service.updateRegistration(registrationId, status).subscribe({
        next: () => fail('should have failed with a 400 status'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne({
        method: 'PUT',
        url: `${apiUrl}/${registrationId}`
      });
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('cancelRegistration', () => {
    it('should cancel registration and return success', () => {
      const registrationId = 'reg123';
      const response = { success: true };

      service.cancelRegistration(registrationId).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne({
        method: 'DELETE',
        url: `${apiUrl}/${registrationId}`
      });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush(response);
    });

    it('should handle error during cancellation', () => {
      const registrationId = 'reg123';
      const errorMessage = 'Error canceling registration';

      service.cancelRegistration(registrationId).subscribe({
        next: () => fail('should have failed with a 500 status'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne({
        method: 'DELETE',
        url: `${apiUrl}/${registrationId}`
      });
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getAllRegistrationsForUser', () => {
    it('should get all registrations for a user', () => {
      const userId = 'user123';
      const response = [{ id: 'reg1', userId, eventId: 'event1' }];

      service.getAllRegistrationsForUser(userId).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: `${apiUrl}/user/${userId}`
      });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush(response);
    });

    it('should handle error during fetching user registrations', () => {
      const userId = 'user123';
      const errorMessage = 'Error fetching user registrations';

      service.getAllRegistrationsForUser(userId).subscribe({
        next: () => fail('should have failed with a 404 status'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: `${apiUrl}/user/${userId}`
      });
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getAllRegistrations', () => {
    it('should get all registrations', () => {
      const response = [{ id: 'reg1', userId: 'user123', eventId: 'event1' }];

      service.getAllRegistrations().subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: apiUrl
      });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush(response);
    });

    it('should handle error during fetching all registrations', () => {
      const errorMessage = 'Error fetching registrations';

      service.getAllRegistrations().subscribe({
        next: () => fail('should have failed with a 500 status'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: apiUrl
      });
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getAllRegistrationsForOrganizer', () => {
    it('should get all registrations for an organizer', () => {
      const organizerId = 'org123';
      const response = [{ id: 'reg1', organizerId, eventId: 'event1' }];

      service.getAllRegistrationsForOrganizer(organizerId).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: `${apiUrl}/organizer/${organizerId}`
      });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush(response);
    });

    it('should handle error during fetching organizer registrations', () => {
      const organizerId = 'org123';
      const errorMessage = 'Error fetching organizer registrations';

      service.getAllRegistrationsForOrganizer(organizerId).subscribe({
        next: () => fail('should have failed with a 404 status'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: `${apiUrl}/organizer/${organizerId}`
      });
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });
});
