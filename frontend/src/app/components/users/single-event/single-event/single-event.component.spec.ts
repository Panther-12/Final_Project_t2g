import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SingleEventComponent } from './single-event.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';

describe('SingleEventComponent', () => {
  let component: SingleEventComponent;
  let fixture: ComponentFixture<SingleEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleEventComponent, RouterTestingModule],
      providers: [
        HttpClient,
        provideHttpClient(withFetch())]
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
