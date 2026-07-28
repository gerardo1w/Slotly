export interface ResponseBookingGetAll {
  id: string;
  pitchId: string;
  complexId: string;
  complexName: string;
  pitchName: string;
  sport: string;
  clientName: string;
  clientEmail: string;
  date: string;
  timeSlot: string;
  price: number;
  status: 'active' | 'cancelled' | 'reserved';
  paymentMethod: 'Yape' | 'Plin' | 'Culqi';
}
