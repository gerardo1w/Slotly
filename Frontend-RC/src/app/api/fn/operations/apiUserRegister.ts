import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestUserRegister, ResponseUserGet } from '../../models';
import { environment } from '../../../environments/environment';

export function apiUserRegister(http: HttpClient, body: RequestUserRegister): Observable<ResponseUserGet> {
  const url = `${environment.urlBase}/usuarios`;
  return http.post<ResponseUserGet>(url, body);
}

export function apiUserSubscribeToPro(http: HttpClient, userId: string): Observable<any> {
  const url = `${environment.urlBase}/usuarios/subscribe`;
  return http.post<any>(url, { userId });
}

export function apiUserToggleBlock(http: HttpClient, userId: string): Observable<any> {
  const url = `${environment.urlBase}/usuarios/toggle-block`;
  return http.post<any>(url, { userId });
}
