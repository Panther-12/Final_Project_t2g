import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersBookingsComponent } from './users-bookings.component';

describe('UsersBookingsComponent', () => {
  let component: UsersBookingsComponent;
  let fixture: ComponentFixture<UsersBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersBookingsComponent]
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
