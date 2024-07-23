import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../../services/auth/auth.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceStub: Partial<AuthService>;

  beforeEach(() => {
    authServiceStub = {};
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AdminGuard);
  });

  describe('when the user is an admin', () => {
    beforeEach(() => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'role') return 'admin';
        return null;
      });
    });

    it('should allow access', () => {
      const result = guard.canActivate();
      expect(result).toBeTrue();
    });
  });

  describe('when the user is an organizer', () => {
    beforeEach(() => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'role') return 'organizer';
        return null;
      });
    });

    it('should allow access', () => {
      const result = guard.canActivate();
      expect(result).toBeTrue();
    });
  });

  describe('when the user is an attendee', () => {
    beforeEach(() => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'role') return 'attendee';
        return null;
      });
    });

    it('should deny access and redirect to login page', () => {
      const result = guard.canActivate();
      expect(result).toBeFalse();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/users/auth/login');
    });
  });

  describe('when the user role is not set', () => {
    beforeEach(() => {
      spyOn(localStorage, 'getItem').and.callFake(() => null);
    });

    it('should deny access and redirect to login page', () => {
      const result = guard.canActivate();
      expect(result).toBeFalse();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/users/auth/login');
    });
  });
});
