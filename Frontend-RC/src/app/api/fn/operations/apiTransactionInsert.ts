import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseTransactionGet } from '../../models';
import { environment } from '../../../environments/environment';

export function apiTransactionInsert(http: HttpClient, body: Omit<ResponseTransactionGet, 'id'>): Observable<any> {
  const url = `${environment.urlBase}/transacciones`;
  return http.post<any>(url, body);
}

export function apiTransactionGetAll(http: HttpClient, complexId: string): Observable<ResponseTransactionGet[]> {
  const url = `${environment.urlBase}/transacciones?complexId=${encodeURIComponent(complexId)}`;
  return http.get<ResponseTransactionGet[]>(url);
}
