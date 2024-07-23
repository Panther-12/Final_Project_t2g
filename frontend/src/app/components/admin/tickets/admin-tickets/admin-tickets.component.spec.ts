import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { AdminTicketsComponent } from './admin-tickets.component';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { of } from 'rxjs';

describe('AdminTicketsComponent', () => {
  let component: AdminTicketsComponent;
  let fixture: ComponentFixture<AdminTicketsComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    activatedRouteStub = {
      paramMap: of(convertToParamMap({ someParam: 'someValue' }))
    };
    await TestBed.configureTestingModule({
      imports: [AdminTicketsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        HttpClient,
        provideHttpClient(withFetch())]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
