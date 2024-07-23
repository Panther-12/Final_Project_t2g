import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersBookingsComponent } from './users-bookings.component';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';

describe('UsersBookingsComponent', () => {
  let component: UsersBookingsComponent;
  let fixture: ComponentFixture<UsersBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersBookingsComponent],
      providers: [
        HttpClient,
        provideHttpClient(withFetch())]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
