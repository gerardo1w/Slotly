import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockDataService, User, Pitch, Booking, Complex, Transaction } from '../shared/services/mock-data.service';
import { environment } from '../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const mockService = inject(MockDataService);

  const url = req.url;
  const method = req.method;

  // --- 1. Intercept Keycloak OAuth2 Token Requests ---
  /* COMENTADO DE MOMENTO - Para implementación futura con Keycloak:
  if (url.includes('/openid-connect/token')) {
    const bodyParams = new URLSearchParams(req.body);
    const grantType = bodyParams.get('grant_type');

    if (grantType === 'password') {
      const username = bodyParams.get('username') || '';
      const password = bodyParams.get('password') || '';

      let matchedUser: User | null = null;
      let errorMsg = '';

      mockService.getUsers().subscribe(users => {
        const u = users.find(usr => usr.email.toLowerCase() === username.toLowerCase());
        if (u) {
          if (u.blocked) {
            errorMsg = 'Este usuario ha sido bloqueado por el administrador.';
          } else {
            matchedUser = u;
          }
        } else {
          errorMsg = 'Credenciales incorrectas o usuario no encontrado.';
        }
      }).unsubscribe();

      if (errorMsg) {
        return throwError(() => new HttpErrorResponse({
          status: 400,
          statusText: 'Bad Request',
          error: errorMsg
        })).pipe(delay(500));
      }

      if (matchedUser) {
        const payload = btoa(JSON.stringify(matchedUser));
        const mockAccessToken = `header.${payload}.signature`;
        const mockRefreshToken = `refresh-token-for-${(matchedUser as User).id}`;

        const tokenResponse = {
          access_token: mockAccessToken,
          refresh_token: mockRefreshToken,
          expires_in: 3600
        };

        return of(new HttpResponse({
          status: 200,
          body: tokenResponse
        })).pipe(delay(500));
      }
    } else if (grantType === 'refresh_token') {
      const rfToken = bodyParams.get('refresh_token') || '';
      const userId = rfToken.replace('refresh-token-for-', '');
      
      let matchedUser: User | null = null;
      mockService.getUsers().subscribe(users => {
        matchedUser = users.find(u => u.id === userId) || null;
      }).unsubscribe();

      if (matchedUser) {
        const payload = btoa(JSON.stringify(matchedUser));
        const tokenResponse = {
          access_token: `header.${payload}.signature`,
          refresh_token: rfToken,
          expires_in: 3600
        };
        return of(new HttpResponse({
          status: 200,
          body: tokenResponse
        })).pipe(delay(200));
      } else {
        return throwError(() => new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
          error: 'Refresh token inválido'
        })).pipe(delay(200));
      }
    }
  }
  */

  // --- 2. Intercept Backend REST API Calls (/api/*) only when mock mode is enabled ---
  if (environment.useMockBackend && url.startsWith(environment.urlBase)) {
    // A. Complejos Controller
    if (url.includes('/complejos')) {
      if (method === 'GET') {
        let complexesList: Complex[] = [];
        if (url.includes('/approved')) {
          mockService.getApprovedComplexes().subscribe(c => complexesList = c).unsubscribe();
        } else {
          mockService.getComplexes().subscribe(c => complexesList = c).unsubscribe();
        }
        return of(new HttpResponse({ status: 200, body: complexesList })).pipe(delay(300));
      }
      if (method === 'POST') {
        const payload = req.body;
        // Mock complex approval
        if (url.endsWith('/approve')) {
          const complexId = payload.complexId;
          mockService.approveComplex(complexId);
          return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(200));
        }
      }
    }

    // B. Canchas (Pitches) Controller
    if (url.includes('/canchas')) {
      if (method === 'GET') {
        let pitchesList: Pitch[] = [];
        // Check if complexId is in query params
        const urlObj = new URL(url);
        const complexId = urlObj.searchParams.get('complexId');
        
        if (complexId) {
          mockService.getPitchesByComplex(complexId).subscribe(p => pitchesList = p).unsubscribe();
        } else {
          mockService.getPitches().subscribe(p => pitchesList = p).unsubscribe();
        }
        return of(new HttpResponse({ status: 200, body: pitchesList })).pipe(delay(300));
      }
      if (method === 'POST') {
        const body = req.body;
        mockService.addPitch(body);
        return of(new HttpResponse({ status: 201, body: { success: true } })).pipe(delay(300));
      }
      if (method === 'PUT') {
        const body = req.body;
        mockService.updatePitch(body);
        return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(300));
      }
      if (method === 'DELETE') {
        const parts = url.split('/');
        const pitchId = parts[parts.length - 1];
        mockService.deletePitch(pitchId);
        return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(300));
      }
    }

    // C. Reservas (Bookings) Controller
    if (url.includes('/reservas')) {
      if (method === 'GET') {
        let bookingsList: Booking[] = [];
        const urlObj = new URL(url);
        const clientEmail = urlObj.searchParams.get('clientEmail');
        const complexId = urlObj.searchParams.get('complexId');

        if (clientEmail) {
          mockService.getBookingsByClient(clientEmail).subscribe(b => bookingsList = b).unsubscribe();
        } else if (complexId) {
          mockService.getBookingsByComplex(complexId).subscribe(b => bookingsList = b).unsubscribe();
        } else {
          mockService.getBookings().subscribe(b => bookingsList = b).unsubscribe();
        }
        return of(new HttpResponse({ status: 200, body: bookingsList })).pipe(delay(300));
      }
      if (method === 'POST') {
        const body = req.body;
        let responseBooking: Booking | null = null;
        let errorMsg = '';

        mockService.createBooking(body).subscribe({
          next: b => responseBooking = b,
          error: err => errorMsg = err
        }).unsubscribe();

        if (errorMsg) {
          return throwError(() => new HttpErrorResponse({
            status: 400,
            statusText: 'Bad Request',
            error: errorMsg
          })).pipe(delay(300));
        }

        return of(new HttpResponse({ status: 201, body: responseBooking })).pipe(delay(300));
      }
      if (method === 'PUT') {
        // Cancel booking
        if (url.endsWith('/cancel')) {
          const bookingId = req.body.bookingId;
          mockService.cancelBooking(bookingId);
          return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(300));
        }
      }
    }

    // D. Usuarios Controller
    if (url.includes('/usuarios')) {
      if (method === 'GET') {
        let usersList: User[] = [];
        mockService.getUsers().subscribe(u => usersList = u).unsubscribe();
        return of(new HttpResponse({ status: 200, body: usersList })).pipe(delay(300));
      }
      if (method === 'POST') {
        const body = req.body;
        // Subscription update
        if (url.endsWith('/subscribe')) {
          mockService.subscribeToPro(body.userId);
          return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(300));
        }
        // Block user
        if (url.endsWith('/toggle-block')) {
          mockService.toggleBlockUser(body.userId);
          return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(300));
        }
        // Register client/owner
        let registeredUser: User | null = null;
        let errorMsg = '';
        mockService.register(body.name, body.email, body.role, body.complexData).subscribe({
          next: u => registeredUser = u,
          error: err => errorMsg = err
        }).unsubscribe();

        if (errorMsg) {
          return throwError(() => new HttpErrorResponse({
            status: 400,
            statusText: 'Bad Request',
            error: errorMsg
          })).pipe(delay(300));
        }
        return of(new HttpResponse({ status: 201, body: registeredUser })).pipe(delay(300));
      }
    }

    // E. Transacciones Controller
    if (url.includes('/transacciones')) {
      if (method === 'GET') {
        const urlObj = new URL(url);
        const complexId = urlObj.searchParams.get('complexId') || '';
        let txsList: Transaction[] = [];
        mockService.getTransactionsByComplex(complexId).subscribe(txs => txsList = txs).unsubscribe();
        return of(new HttpResponse({ status: 200, body: txsList })).pipe(delay(200));
      }
      if (method === 'POST') {
        const body = req.body;
        mockService.addTransaction(body);
        return of(new HttpResponse({ status: 201, body: { success: true } })).pipe(delay(200));
      }
    }

    // F. Cierres Controller
    if (url.includes('/cierres')) {
      if (method === 'GET') {
        const urlObj = new URL(url);
        const complexId = urlObj.searchParams.get('complexId') || '';
        let closuresList: any[] = [];
        mockService.getClosuresByComplex(complexId).subscribe(cls => closuresList = cls).unsubscribe();
        return of(new HttpResponse({ status: 200, body: closuresList })).pipe(delay(200));
      }
      if (method === 'POST') {
        const body = req.body;
        let responseClosure: any = null;
        let errorMsg = '';
        mockService.doCashClosure(body.complexId, body.closedBy).subscribe({
          next: c => responseClosure = c,
          error: err => errorMsg = err
        }).unsubscribe();

        if (errorMsg) {
          return throwError(() => new HttpErrorResponse({
            status: 400,
            statusText: 'Bad Request',
            error: errorMsg
          })).pipe(delay(200));
        }
        return of(new HttpResponse({ status: 201, body: responseClosure })).pipe(delay(200));
      }
    }
  }

  // --- 3. Pass-through for real HTTP requests (with Authorization headers) ---
  const token = localStorage.getItem('access_token');
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  return next(req);
};
