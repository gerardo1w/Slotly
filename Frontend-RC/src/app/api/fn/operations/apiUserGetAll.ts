import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseUserGet } from '../../models';
import { environment } from '../../../environments/environment';

export function apiUserGetAll(http: HttpClient): Observable<ResponseUserGet[]> {
  const url = `${environment.urlBase}/usuarios`;
  return http.get<ResponseUserGet[]>(url);
}
