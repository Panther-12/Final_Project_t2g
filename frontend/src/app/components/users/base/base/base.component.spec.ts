import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { BaseComponent } from './base.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    activatedRouteStub = {
      paramMap: of(convertToParamMap({ someParam: 'someValue' }))
    };
    await TestBed.configureTestingModule({
      imports: [BaseComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        HttpClient,
        provideHttpClient(withFetch())]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
