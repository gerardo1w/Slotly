import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseBookingGetAll } from '../../models/response-booking-get-all';
import { environment } from '../../../environments/environment';

export interface ApiBookingGetAllParams {
  clientEmail?: string;
  complexId?: string;
}

export function apiBookingGetAll(http: HttpClient, params?: ApiBookingGetAllParams): Observable<ResponseBookingGetAll[]> {
  let url = `${environment.urlBase}/reservas`;
  const queryParams: string[] = [];
  if (params?.clientEmail) {
    queryParams.push(`clientEmail=${encodeURIComponent(params.clientEmail)}`);
  }
  if (params?.complexId) {
    queryParams.push(`complexId=${encodeURIComponent(params.complexId)}`);
  }
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }
  return http.get<ResponseBookingGetAll[]>(url);
}

export function apiBookingCancel(http: HttpClient, bookingId: string): Observable<any> {
  const url = `${environment.urlBase}/reservas/cancel`;
  return http.put<any>(url, { bookingId });
}
