import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestBookingInsert } from '../../models/request-booking-insert';
import { ResponseBookingGetAll } from '../../models/response-booking-get-all';
import { environment } from '../../../environments/environment';

export function apiBookingInsert(http: HttpClient, body: RequestBookingInsert): Observable<ResponseBookingGetAll> {
  const url = `${environment.urlBase}/reservas`;
  return http.post<ResponseBookingGetAll>(url, body);
}
