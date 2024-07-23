import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VenueService } from './venue.service';

describe('VenueService', () => {
  let service: VenueService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/venues';
  const dummyVenue = { id: '1', name: 'Test Venue', location: 'Test Location' };
  const dummyVenues = [dummyVenue];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VenueService]
    });

    service = TestBed.inject(VenueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createVenue', () => {
    it('should create a venue and return it', () => {
      service.createVenue(dummyVenue).subscribe(venue => {
        expect(venue).toEqual(dummyVenue);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dummyVenue);
      req.flush(dummyVenue);
    });
  });

  describe('getAllVenues', () => {
    it('should return an array of venues', () => {
      service.getAllVenues().subscribe(venues => {
        expect(venues).toEqual(dummyVenues);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(dummyVenues);
    });
  });

  describe('getVenueById', () => {
    it('should return a single venue by id', () => {
      const venueId = '1';
      service.getVenueById(venueId).subscribe(venue => {
        expect(venue).toEqual(dummyVenue);
      });

      const req = httpMock.expectOne(`${apiUrl}/${venueId}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyVenue);
    });
  });

  describe('updateVenue', () => {
    it('should update a venue and return it', () => {
      const updatedVenue = { ...dummyVenue, name: 'Updated Venue' };
      const venueId = '1';

      service.updateVenue(venueId, updatedVenue).subscribe(venue => {
        expect(venue).toEqual(updatedVenue);
      });

      const req = httpMock.expectOne(`${apiUrl}/${venueId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedVenue);
      req.flush(updatedVenue);
    });
  });

  describe('deleteVenue', () => {
    it('should delete a venue and return a confirmation', () => {
      const venueId = '1';

      service.deleteVenue(venueId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${venueId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
