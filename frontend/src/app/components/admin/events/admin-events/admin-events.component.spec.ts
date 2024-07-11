import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventsComponent } from './admin-events.component';

describe('AdminEventsComponent', () => {
  let component: AdminEventsComponent;
  let fixture: ComponentFixture<AdminEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
