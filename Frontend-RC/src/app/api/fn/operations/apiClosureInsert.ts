import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseClosureGet } from '../../models';
import { environment } from '../../../environments/environment';

export function apiClosureInsert(http: HttpClient, body: { complexId: string; closedBy: string }): Observable<ResponseClosureGet> {
  const url = `${environment.urlBase}/cierres`;
  return http.post<ResponseClosureGet>(url, body);
}

export function apiClosureGetAll(http: HttpClient, complexId: string): Observable<ResponseClosureGet[]> {
  const url = `${environment.urlBase}/cierres?complexId=${encodeURIComponent(complexId)}`;
  return http.get<ResponseClosureGet[]>(url);
}
