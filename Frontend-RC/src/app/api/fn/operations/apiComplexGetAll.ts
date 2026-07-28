import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseComplexGet } from '../../models';
import { environment } from '../../../environments/environment';

export function apiComplexGetAll(http: HttpClient, approvedOnly: boolean = false): Observable<ResponseComplexGet[]> {
  const url = `${environment.urlBase}/complejos${approvedOnly ? '/approved' : ''}`;
  return http.get<ResponseComplexGet[]>(url);
}
