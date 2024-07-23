import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketFormComponent } from './ticket-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('TicketFormComponent', () => {
  let component: TicketFormComponent;
  let fixture: ComponentFixture<TicketFormComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    activatedRouteStub = {
      paramMap: of(convertToParamMap({ someParam: 'someValue' }))
    };
    await TestBed.configureTestingModule({
      imports: [TicketFormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        HttpClient,
        provideHttpClient(withFetch()), NgbActiveModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
