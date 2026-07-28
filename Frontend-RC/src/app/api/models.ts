export * from './models/request-booking-insert';
export * from './models/response-booking-get-all';
export * from './models/request-pitch-insert';
export * from './models/request-user-register';

export interface ResponseComplexGet {
  id: string;
  name: string;
  address: string;
  district: string;
  ownerId: string;
  status: 'pending' | 'approved';
  phone: string;
  image: string;
  rating?: number;
  reviewsCount?: number;
  pitchesCount?: number;
  timeRange?: string;
  active?: boolean;
}

export interface ResponsePitchGet {
  id: string;
  complexId: string;
  name: string;
  sport: 'Fútbol' | 'Tenis' | 'Básquet' | 'Pádel' | 'Vóley';
  pricePerHour: number;
  image: string;
  active: boolean;
}

export interface ResponseUserGet {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'owner' | 'admin';
  subscription: 'free' | 'pro';
  complexId?: string;
  blocked?: boolean;
}

export interface ResponseTransactionGet {
  id: string;
  complexId: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
}

export interface ResponseClosureGet {
  id: string;
  complexId: string;
  date: string;
  totalIncomes: number;
  totalExpenses: number;
  finalBalance: number;
  closedBy: string;
}
