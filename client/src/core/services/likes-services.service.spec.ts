import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LikesServicesService } from './likes-services.service';

describe('LikesServicesService', () => {
  let service: LikesServicesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LikesServicesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(LikesServicesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('adds a liked member id to the local likeIds signal after a successful toggle', () => {
    service.likeIds.set([]);

    service.toggleLike('member-1').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}likes/member-1`);
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(service.likeIds()).toEqual(['member-1']);
  });
});
