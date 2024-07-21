import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVenuesComponent } from './admin-venues.component';

describe('AdminVenuesComponent', () => {
  let component: AdminVenuesComponent;
  let fixture: ComponentFixture<AdminVenuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVenuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVenuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
