import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegistrationService } from './registration.service';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/registration';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMjJlNTQwMC0xZWY0LTQ0NTctOTFiOC0wOTUwYzZiYTZhZmQiLCJpYXQiOjE3MjE2ODIxNDUsImV4cCI6MTcyMTY4NTc0NX0.fRMv1dqqSqdC_6ha1XbkPHWbrJKC33aljk2fxsj-17A';
  localStorage.setItem('token', token)

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegistrationService]
    });

    service = TestBed.inject(RegistrationService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock token in localStorage
    spyOn(localStorage, 'getItem').and.returnValue(token);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user for an event', (done) => {
    const registrationData = { userId: '123', eventId: '456' };
    const response = { success: true };

    service.registerUserForEvent(registrationData).subscribe(res => {
      expect(res).toEqual(response);
      done();
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: apiUrl
    });
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toEqual(registrationData);
    req.flush(response);
  });

  it('should get a registration by id', (done) => {
    const registrationId = '123';
    const response = { id: registrationId, userId: '456', eventId: '789' };

    service.getRegistrationById(registrationId).subscribe(res => {
      expect(res).toEqual(response);
      done();
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: `${apiUrl}/${registrationId}`
    });
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(response);
  });

  it('should update a registration status', (done) => {
    const registrationId = '123';
    const status = 'active';
    const response = { success: true };

    service.updateRegistration(registrationId, status).subscribe(res => {
      expect(res).toEqual(response);
      done();
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

  it('should cancel a registration', (done) => {
    const registrationId = '123';
    const response = { success: true };

    service.cancelRegistration(registrationId).subscribe(res => {
      expect(res).toEqual(response);
      done();
    });

    const req = httpMock.expectOne({
      method: 'DELETE',
      url: `${apiUrl}/${registrationId}`
    });
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(response);
  });

  it('should get all registrations for a user', (done) => {
    const userId = 'user123';
    const response = [{ id: 'reg1', userId, eventId: 'event1' }];

    service.getAllRegistrationsForUser(userId).subscribe(res => {
      expect(res).toEqual(response);
      done();
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: `${apiUrl}/user/${userId}`
    });
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(response);
  });

  it('should get all registrations', (done) => {
    const response = [{ id: 'reg1', userId: 'user123', eventId: 'event1' }];

    service.getAllRegistrations().subscribe(res => {
      expect(res).toEqual(response);
      done();
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: apiUrl
    });
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(response);
  });

  it('should get all registrations for an organizer', (done) => {
    const organizerId = 'org123';
    const response = [{ id: 'reg1', organizerId, eventId: 'event1' }];

    service.getAllRegistrationsForOrganizer(organizerId).subscribe(res => {
      expect(res).toEqual(response);
      done();
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: `${apiUrl}/organizer/${organizerId}`
    });
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(response);
  });
});
