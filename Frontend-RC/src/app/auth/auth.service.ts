import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, fromEvent, merge, Subscription, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'owner' | 'admin';
  subscription: 'free' | 'pro';
  complexId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Inactivity tracking
  private inactivitySubscription?: Subscription;
  private inactivityTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds
  private inactivityTimer: any;

  constructor(
    private http: HttpClient, 
    private ngZone: NgZone,
    private router: Router
  ) {
    this.restoreSession();
  }

  private restoreSession() {
    const token = localStorage.getItem('access_token');
    const profileStr = localStorage.getItem('user_profile');
    if (token && profileStr) {
      const profile = JSON.parse(profileStr);
      this.currentUserSubject.next(profile);
      this.startInactivityTimer();
    }
  }

  public login(username: string, password: string): Observable<TokenResponse> {
    const body = {
      email: username,
      password: password
    };

    const url = `${environment.urlBase}/usuarios/login`;

    return this.http.post<any>(url, body).pipe(
      map(user => {
        const tokenRes: TokenResponse = {
          access_token: `header.${this.base64urlEncode(JSON.stringify(user))}.signature`,
          refresh_token: `refresh-token-for-${user.id}`,
          expires_in: 3600
        };

        localStorage.setItem('access_token', tokenRes.access_token);
        localStorage.setItem('refresh_token', tokenRes.refresh_token);
        localStorage.setItem('user_profile', JSON.stringify(user));
        this.currentUserSubject.next(user);

        this.startInactivityTimer();
        return tokenRes;
      }),
      catchError(err => {
        throw err;
      })
    );
  }

  public refreshToken(): Observable<TokenResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      return of({} as TokenResponse);
    }

    /* COMENTADO DE MOMENTO - Para implementación futura con Keycloak:
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id', environment.keycloak.clientId)
      .set('refresh_token', refreshToken);

    const tokenUrl = `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/token`;

    return this.http.post<TokenResponse>(tokenUrl, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
      }),
      catchError(err => {
        this.logout();
        throw err;
      })
    );
    */

    const profileStr = localStorage.getItem('user_profile');
    if (profileStr) {
      const profile = JSON.parse(profileStr) as UserProfile;
      const tokenRes: TokenResponse = {
        access_token: `header.${this.base64urlEncode(JSON.stringify(profile))}.signature`,
        refresh_token: refreshToken,
        expires_in: 3600
      };
      localStorage.setItem('access_token', tokenRes.access_token);
      localStorage.setItem('refresh_token', tokenRes.refresh_token);
      return of(tokenRes).pipe(delay(100));
    } else {
      this.logout();
      return throwError(() => new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
        error: 'Refresh token inválido'
      })).pipe(delay(100));
    }
  }

  public logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_profile');
    this.currentUserSubject.next(null);
    this.stopInactivityTimer();
    this.router.navigate(['/login']);
  }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public getUserProfile(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  public updateUserProfile(profile: UserProfile) {
    localStorage.setItem('user_profile', JSON.stringify(profile));
    this.currentUserSubject.next(profile);
  }

  public subscribeToPro(userId: string) {
    const profile = this.getUserProfile();
    if (profile && profile.id === userId) {
      profile.subscription = 'pro';
      this.updateUserProfile(profile);
    }
  }

  // Helper to mock OIDC token encoding
  private base64urlEncode(str: string): string {
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  // Helper to mock OIDC token decoding
  private decodeToken(token: string): UserProfile {
    try {
      const parts = token.split('.');
      if (parts.length < 2) {
        // Fallback for simple testing text token
        return JSON.parse(token);
      }
      const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(payload);
    } catch (e) {
      // Fallback
      return { id: 'usr-1', email: 'cliente@test.com', name: 'User', role: 'client', subscription: 'free' };
    }
  }

  // --- Inactivity Timer (1 Minute) ---
  private startInactivityTimer() {
    this.stopInactivityTimer();

    // Listen to mouse movement, clicks, keypresses, and touch events
    const activityEvents$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'click'),
      fromEvent(document, 'keypress'),
      fromEvent(document, 'touchstart')
    );

    this.ngZone.runOutsideAngular(() => {
      this.resetInactivityTimer();

      this.inactivitySubscription = activityEvents$.subscribe(() => {
        this.resetInactivityTimer();
      });
    });
  }

  private resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      this.ngZone.run(() => {
        console.warn('Cerrando sesión por inactividad física (1 minuto)');
        this.logout();
      });
    }, this.inactivityTimeout);
  }

  private stopInactivityTimer() {
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
    }
    clearTimeout(this.inactivityTimer);
  }
}
