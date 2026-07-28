import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export function apiComplexApprove(http: HttpClient, complexId: string): Observable<any> {
  const url = `${environment.urlBase}/complejos/approve`;
  return http.post<any>(url, { complexId });
}
