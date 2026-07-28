import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponsePitchGet } from '../../models';
import { environment } from '../../../environments/environment';

export function apiPitchGetAll(http: HttpClient, complexId?: string): Observable<ResponsePitchGet[]> {
  let url = `${environment.urlBase}/canchas`;
  if (complexId) {
    url += `?complexId=${encodeURIComponent(complexId)}`;
  }
  return http.get<ResponsePitchGet[]>(url);
}
