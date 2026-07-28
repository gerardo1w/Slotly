import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseComplexGet } from '../../models';
import { environment } from '../../../environments/environment';

export function apiComplexUpdate(http: HttpClient, body: ResponseComplexGet): Observable<any> {
  const url = `${environment.urlBase}/complejos`;
  return http.put<any>(url, body);
}
