import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestPitchInsert, ResponsePitchGet } from '../../models';
import { environment } from '../../../environments/environment';

export function apiPitchInsert(http: HttpClient, body: RequestPitchInsert): Observable<any> {
  const url = `${environment.urlBase}/canchas`;
  return http.post<any>(url, body);
}

export function apiPitchUpdate(http: HttpClient, body: ResponsePitchGet): Observable<any> {
  const url = `${environment.urlBase}/canchas`;
  return http.put<any>(url, body);
}

export function apiPitchDelete(http: HttpClient, pitchId: string): Observable<any> {
  const url = `${environment.urlBase}/canchas/${pitchId}`;
  return http.delete<any>(url);
}
