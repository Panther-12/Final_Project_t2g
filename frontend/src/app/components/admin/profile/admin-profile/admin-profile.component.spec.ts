import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminProfileComponent } from './admin-profile.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('AdminProfileComponent', () => {
  let component: AdminProfileComponent;
  let fixture: ComponentFixture<AdminProfileComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    activatedRouteStub = {
      paramMap: of(convertToParamMap({ someParam: 'someValue' }))
    };
    await TestBed.configureTestingModule({
      imports: [AdminProfileComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        HttpClient,
        provideHttpClient(withFetch()), NgbActiveModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
