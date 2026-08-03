import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { MockDataService } from '../shared/services/mock-data.service';
import { of } from 'rxjs';

describe('authInterceptor', () => {
  let mockDataService: MockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockDataService]
    });
    mockDataService = TestBed.inject(MockDataService);
  });

  it('debería ejecutar el handler siguiente para peticiones normales', (done) => {
    const req = new HttpRequest('GET', '/api/complejos');
    const mockNext: HttpHandlerFn = (r) => of(new HttpResponse({ status: 200 }));

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, mockNext).subscribe(res => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });
});
