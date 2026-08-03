import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  const mockRoute = { data: {} } as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería permitir acceso cuando el usuario está autenticado', () => {
    localStorage.setItem('access_token', 'valid-token');
    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );
    expect(result).toBeTrue();
  });

  it('debería redirigir a /login cuando no hay token', () => {
    localStorage.removeItem('access_token');
    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería permitir acceso si el rol coincide con los roles requeridos', () => {
    localStorage.setItem('access_token', 'valid-token');
    const profile = { id: 'u-1', email: 'test@test.com', name: 'Test', role: 'owner' as const, subscription: 'free' as const };
    authService.updateUserProfile(profile);

    const routeWithRoles = { data: { roles: ['owner'] } } as unknown as ActivatedRouteSnapshot;
    const result = TestBed.runInInjectionContext(() =>
      authGuard(routeWithRoles, mockState)
    );
    expect(result).toBeTrue();
  });

  it('debería redirigir a /home si el rol no coincide', () => {
    localStorage.setItem('access_token', 'valid-token');
    const profile = { id: 'u-1', email: 'test@test.com', name: 'Test', role: 'client' as const, subscription: 'free' as const };
    authService.updateUserProfile(profile);

    const routeWithRoles = { data: { roles: ['admin'] } } as unknown as ActivatedRouteSnapshot;
    const result = TestBed.runInInjectionContext(() =>
      authGuard(routeWithRoles, mockState)
    );
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
