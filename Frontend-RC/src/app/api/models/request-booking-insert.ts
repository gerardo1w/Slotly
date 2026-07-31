export interface RequestBookingInsert {
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
  paymentMethod: 'Yape' | 'Plin' | 'Culqi';
  status?: 'active' | 'reserved';
}
