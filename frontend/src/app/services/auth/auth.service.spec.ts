import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') } }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('isSuperAdmin', () => {
    it('should return true if role is admin or organizer', () => {
      service['currentUser'] = { role: 'organizer' };
      expect(service.isOrganizer()).toBeTrue();
    });

    it('should return false if role is neither admin nor organizer', () => {
      spyOn(localStorage, 'getItem').and.returnValue('attendee');
      expect(service.isSuperAdmin()).toBeFalse();
    });
  });

  describe('isOrganizer', () => {
    it('should return true if currentUser role is organizer', () => {
      service['currentUser'] = { role: 'organizer' };
      expect(service.isOrganizer()).toBeTrue();
    });

    it('should return false if currentUser role is not organizer', () => {
      service['currentUser'] = { role: 'attendee' };
      expect(service.isOrganizer()).toBeFalse();
    });
  });

  describe('isAttendee', () => {
    it('should return true if currentUser role is attendee', () => {
      service['currentUser'] = { role: 'attendee' };
      expect(service.isAttendee()).toBeTrue();
    });

    it('should return false if currentUser role is not attendee', () => {
      service['currentUser'] = { role: 'organizer' };
      expect(service.isAttendee()).toBeFalse();
    });
  });
});
