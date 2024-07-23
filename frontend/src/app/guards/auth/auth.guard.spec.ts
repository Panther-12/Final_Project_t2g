import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../../services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

// Mock AuthService
class MockAuthService {}

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: MockAuthService }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  describe('when the user is logged in', () => {
    beforeEach(() => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'userId') return 'someUserId';
        if (key === 'role') return 'someRole';
        return null;
      });
    });

    it('should allow access to the route', () => {
      const result = authGuard.canActivate({} as any, {} as any);
      expect(result).toBeTrue();
    });
  });

  describe('when the user is not logged in', () => {
    beforeEach(() => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => null);
      spyOn(router, 'navigate');
    });

    it('should redirect to login page', () => {
      const result = authGuard.canActivate({} as any, {} as any);
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
