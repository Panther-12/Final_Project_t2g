import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleEventComponent } from './single-event.component';

describe('SingleEventComponent', () => {
  let component: SingleEventComponent;
  let fixture: ComponentFixture<SingleEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
