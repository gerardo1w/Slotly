import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { AuthService, UserProfile } from './auth.service';

@Component({ standalone: true, template: '' })
class DummyComponent {}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockProfile: UserProfile = {
    id: 'u-1',
    email: 'juan@gmail.com',
    name: 'Juan Perez',
    role: 'client',
    subscription: 'free'
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent },
          { path: 'home', component: DummyComponent }
        ]),
        DummyComponent
      ],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
    localStorage.clear();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn() debería retornar false cuando no hay token', () => {
    localStorage.removeItem('access_token');
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('isLoggedIn() debería retornar true cuando hay token', () => {
    localStorage.setItem('access_token', 'test-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('getToken() debería retornar null si no hay token', () => {
    expect(service.getToken()).toBeNull();
  });

  it('getToken() debería retornar el token almacenado', () => {
    localStorage.setItem('access_token', 'mi-token-123');
    expect(service.getToken()).toBe('mi-token-123');
  });

  it('getUserProfile() debería retornar null si no hay sesión activa', () => {
    expect(service.getUserProfile()).toBeNull();
  });

  it('updateUserProfile() debería actualizar el perfil en memoria y localStorage', () => {
    service.updateUserProfile(mockProfile);
    const stored = JSON.parse(localStorage.getItem('user_profile')!);
    expect(stored.email).toBe('juan@gmail.com');
    expect(service.getUserProfile()?.email).toBe('juan@gmail.com');
  });

  it('logout() debería limpiar localStorage y perfil de usuario', () => {
    localStorage.setItem('access_token', 'token');
    localStorage.setItem('user_profile', JSON.stringify(mockProfile));
    service.logout();
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('user_profile')).toBeNull();
    expect(service.getUserProfile()).toBeNull();
  });

  it('login() debería guardar token en localStorage tras respuesta exitosa', fakeAsync(() => {
    let result: any;
    service.login('juan@gmail.com', 'password123').subscribe(res => result = res);

    const req = httpMock.expectOne(req => req.url.includes('/usuarios/login'));
    expect(req.request.method).toBe('POST');
    req.flush(mockProfile);
    tick();

    expect(localStorage.getItem('access_token')).toBeTruthy();
    expect(result).toBeTruthy();
    expect(result.expires_in).toBe(3600);
  }));
});
