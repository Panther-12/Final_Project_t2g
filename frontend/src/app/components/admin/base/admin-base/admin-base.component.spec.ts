import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBaseComponent } from './admin-base.component';

describe('AdminBaseComponent', () => {
  let component: AdminBaseComponent;
  let fixture: ComponentFixture<AdminBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
