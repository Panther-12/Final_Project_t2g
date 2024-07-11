import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAttendeesComponent } from './admin-attendees.component';

describe('AdminAttendeesComponent', () => {
  let component: AdminAttendeesComponent;
  let fixture: ComponentFixture<AdminAttendeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAttendeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAttendeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
