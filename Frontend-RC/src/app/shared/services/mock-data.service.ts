import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'owner' | 'admin';
  subscription: 'free' | 'pro';
  complexId?: string; // Links owner to their complex
  blocked?: boolean;
}

export interface Complex {
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
}

export interface Pitch {
  id: string;
  complexId: string;
  name: string;
  sport: 'Fútbol' | 'Tenis' | 'Básquet' | 'Pádel' | 'Vóley';
  pricePerHour: number;
  image: string;
  active: boolean;
}

export interface Booking {
  id: string;
  pitchId: string;
  complexId: string;
  complexName: string;
  pitchName: string;
  sport: string;
  clientName: string;
  clientEmail: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "08:00 - 09:00"
  price: number;
  status: 'active' | 'cancelled' | 'reserved';
  paymentMethod: 'Yape' | 'Plin' | 'Culqi';
}

export interface Transaction {
  id: string;
  complexId: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
}

export interface CashClosure {
  id: string;
  complexId: string;
  date: string;
  totalIncomes: number;
  totalExpenses: number;
  finalBalance: number;
  closedBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // State management using BehaviorSubjects
  private users$ = new BehaviorSubject<User[]>([]);
  private complexes$ = new BehaviorSubject<Complex[]>([]);
  private pitches$ = new BehaviorSubject<Pitch[]>([]);
  private bookings$ = new BehaviorSubject<Booking[]>([]);
  private transactions$ = new BehaviorSubject<Transaction[]>([]);
  private closures$ = new BehaviorSubject<CashClosure[]>([]);
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor() {
    this.loadInitialData();
  }

  // --- Seed Initial Mock Data ---
  private loadInitialData() {
    // 1. Initial Users
    const initialUsers: User[] = [
      { id: 'usr-1', email: 'cliente@test.com', name: 'Carlos Mendoza', role: 'client', subscription: 'free' },
      { id: 'usr-2', email: 'dueno.free@test.com', name: 'Carlos Mendoza', role: 'owner', subscription: 'free', complexId: 'cplx-1' },
      { id: 'usr-3', email: 'dueno.pro@test.com', name: 'Sofía Rivas', role: 'owner', subscription: 'pro', complexId: 'cplx-2' },
      { id: 'usr-4', email: 'admin@test.com', name: 'Administrador General', role: 'admin', subscription: 'free' },
      { id: 'usr-5', email: 'owner.pending@test.com', name: 'Miguel Torres', role: 'owner', subscription: 'free', complexId: 'cplx-3' }
    ];
    this.users$.next(initialUsers);

    // 2. Initial Complexes
    const initialComplexes: Complex[] = [
      {
        id: 'cplx-1',
        name: 'Complejo Deportivo Norte',
        address: 'Av. Los Deportistas 1240, Lima Norte',
        district: 'Lima Norte',
        ownerId: 'usr-2',
        status: 'approved',
        phone: '51987001001',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=60',
        rating: 4.8,
        reviewsCount: 142,
        pitchesCount: 4,
        timeRange: '7:00 am - 10:00 pm'
      },
      {
        id: 'cplx-2',
        name: 'Arena Vóley Club',
        address: 'Jr. Palmas 480, Miraflores',
        district: 'Miraflores',
        ownerId: 'usr-3',
        status: 'approved',
        phone: '51987001002',
        image: 'https://images.unsplash.com/photo-1592656094267-764a45068526?w=600&auto=format&fit=crop&q=60',
        rating: 4.6,
        reviewsCount: 89,
        pitchesCount: 3,
        timeRange: '8:00 am - 9:00 pm'
      },
      {
        id: 'cplx-3',
        name: 'Cancha 3 Puntos',
        address: 'Calle San Martín 771, Barranco',
        district: 'Barranco',
        ownerId: 'usr-5',
        status: 'approved',
        phone: '51987001003',
        image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=600&auto=format&fit=crop&q=60',
        rating: 4.9,
        reviewsCount: 203,
        pitchesCount: 2,
        timeRange: '6:00 am - 11:00 pm'
      },
      {
        id: 'cplx-4',
        name: 'Polideportivo La Victoria',
        address: 'Av. Manco Cápac 320, La Victoria',
        district: 'La Victoria',
        ownerId: 'usr-4',
        status: 'approved',
        phone: '51987001004',
        image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&auto=format&fit=crop&q=60',
        rating: 4.5,
        reviewsCount: 67,
        pitchesCount: 6,
        timeRange: '7:00 am - 11:00 pm'
      }
    ];
    this.complexes$.next(initialComplexes);

    // 3. Initial Pitches
    const initialPitches: Pitch[] = [
      { id: 'pch-1', complexId: 'cplx-1', name: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', pricePerHour: 80, image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=60', active: true },
      { id: 'pch-2', complexId: 'cplx-2', name: 'Cancha Vóley Arena', sport: 'Vóley', pricePerHour: 60, image: 'https://images.unsplash.com/photo-1592656094267-764a45068526?w=400&auto=format&fit=crop&q=60', active: true },
      { id: 'pch-3', complexId: 'cplx-3', name: 'Losa Básquet Oficial', sport: 'Básquet', pricePerHour: 50, image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=400&auto=format&fit=crop&q=60', active: true },
      { id: 'pch-4', complexId: 'cplx-4', name: 'Cancha Fútbol Sintético Victoria', sport: 'Fútbol', pricePerHour: 70, image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&auto=format&fit=crop&q=60', active: true }
    ];
    this.pitches$.next(initialPitches);

    // 4. Initial Bookings (Calculate current week dates dynamically for calendar grid display)
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    
    const monStr = formatDate(monday);
    const tue = new Date(monday); tue.setDate(monday.getDate() + 1); const tueStr = formatDate(tue);
    const wed = new Date(monday); wed.setDate(monday.getDate() + 2); const wedStr = formatDate(wed);
    const thu = new Date(monday); thu.setDate(monday.getDate() + 3); const thuStr = formatDate(thu);
    const fri = new Date(monday); fri.setDate(monday.getDate() + 4); const friStr = formatDate(fri);
    const sat = new Date(monday); sat.setDate(monday.getDate() + 5); const satStr = formatDate(sat);
    const sun = new Date(monday); sun.setDate(monday.getDate() + 6); const sunStr = formatDate(sun);

    const initialBookings: Booking[] = [
      // Monday
      { id: 'bkg-1', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: monStr, timeSlot: '08:00 - 09:00', price: 80, status: 'active', paymentMethod: 'Yape' },
      { id: 'bkg-2', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Carlos Mendoza', clientEmail: 'dueno.free@test.com', date: monStr, timeSlot: '09:00 - 10:00', price: 80, status: 'active', paymentMethod: 'Yape' },
      { id: 'bkg-3', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Sofía Rivas', clientEmail: 'dueno.pro@test.com', date: monStr, timeSlot: '12:00 - 13:00', price: 80, status: 'active', paymentMethod: 'Plin' },
      
      // Tuesday
      { id: 'bkg-4', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: tueStr, timeSlot: '07:00 - 08:00', price: 80, status: 'active', paymentMethod: 'Yape' },
      { id: 'bkg-5', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: tueStr, timeSlot: '08:00 - 09:00', price: 80, status: 'active', paymentMethod: 'Yape' },
      { id: 'bkg-6', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: tueStr, timeSlot: '11:00 - 12:00', price: 80, status: 'active', paymentMethod: 'Plin' },

      // Wednesday
      { id: 'bkg-7', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: wedStr, timeSlot: '09:00 - 10:00', price: 80, status: 'active', paymentMethod: 'Yape' },
      
      // Thursday
      { id: 'bkg-8', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: thuStr, timeSlot: '09:00 - 10:00', price: 80, status: 'active', paymentMethod: 'Yape' },
      
      // Friday
      { id: 'bkg-9', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: friStr, timeSlot: '07:00 - 08:00', price: 80, status: 'active', paymentMethod: 'Yape' },
      { id: 'bkg-10', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: friStr, timeSlot: '10:00 - 11:00', price: 80, status: 'active', paymentMethod: 'Yape' },

      // Saturday
      { id: 'bkg-11', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: satStr, timeSlot: '08:00 - 09:00', price: 80, status: 'reserved', paymentMethod: 'Yape' },
      { id: 'bkg-12', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: satStr, timeSlot: '09:00 - 10:00', price: 80, status: 'reserved', paymentMethod: 'Yape' },
      { id: 'bkg-13', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: satStr, timeSlot: '10:00 - 11:00', price: 80, status: 'reserved', paymentMethod: 'Yape' },
      { id: 'bkg-14', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: satStr, timeSlot: '11:00 - 12:00', price: 80, status: 'reserved', paymentMethod: 'Yape' },
      { id: 'bkg-15', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: satStr, timeSlot: '13:00 - 14:00', price: 80, status: 'reserved', paymentMethod: 'Yape' },

      // Sunday
      { id: 'bkg-16', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: sunStr, timeSlot: '09:00 - 10:00', price: 80, status: 'reserved', paymentMethod: 'Yape' },
      { id: 'bkg-17', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: sunStr, timeSlot: '10:00 - 11:00', price: 80, status: 'reserved', paymentMethod: 'Yape' },
      { id: 'bkg-18', pitchId: 'pch-1', complexId: 'cplx-1', complexName: 'Complejo Deportivo Norte', pitchName: 'Cancha Fútbol Sintético 1', sport: 'Fútbol', clientName: 'Juan Pérez', clientEmail: 'cliente@test.com', date: sunStr, timeSlot: '11:00 - 12:00', price: 80, status: 'reserved', paymentMethod: 'Yape' }
    ];
    this.bookings$.next(initialBookings);

    // 5. Initial Transactions
    const todayStr = formatDate(today);
    const initialTransactions: Transaction[] = [
      { id: 'tx-1', complexId: 'cplx-1', type: 'income', description: 'Reserva Cancha Fútbol Sintético 1 (bkg-1)', amount: 80, date: todayStr },
      { id: 'tx-2', complexId: 'cplx-2', type: 'income', description: 'Reserva Cancha Vóley Arena (bkg-2)', amount: 60, date: todayStr },
      { id: 'tx-3', complexId: 'cplx-2', type: 'expense', description: 'Compra de pelotas de tenis de mesa', amount: 35, date: todayStr }
    ];
    this.transactions$.next(initialTransactions);
  }

  // --- Auth Actions ---
  public login(email: string, password: string): Observable<User | null> {
    return new Observable<User | null>(observer => {
      // Basic mock auth check (any user in list with correct email matches)
      const user = this.users$.value.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        if (user.blocked) {
          observer.error('Este usuario ha sido bloqueado por el administrador.');
        } else {
          this.currentUser$.next(user);
          observer.next(user);
        }
      } else {
        observer.error('Credenciales incorrectas o usuario no encontrado.');
      }
      observer.complete();
    });
  }

  public register(name: string, email: string, role: 'client' | 'owner', complexData?: { name: string; address: string; district: string; phone: string }): Observable<User> {
    return new Observable<User>(observer => {
      const existing = this.users$.value.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        observer.error('El correo electrónico ya se encuentra registrado.');
        observer.complete();
        return;
      }

      const newUserId = `usr-${Date.now()}`;
      const newUser: User = {
        id: newUserId,
        email: email,
        name: name,
        role: role,
        subscription: 'free'
      };

      if (role === 'owner' && complexData) {
        const newComplexId = `cplx-${Date.now()}`;
        newUser.complexId = newComplexId;

        const newComplex: Complex = {
          id: newComplexId,
          name: complexData.name,
          address: complexData.address,
          district: complexData.district,
          ownerId: newUserId,
          status: 'pending', // Awaiting admin approval
          phone: complexData.phone,
          image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&auto=format&fit=crop&q=60'
        };

        const updatedComplexes = [...this.complexes$.value, newComplex];
        this.complexes$.next(updatedComplexes);
      }

      const updatedUsers = [...this.users$.value, newUser];
      this.users$.next(updatedUsers);
      observer.next(newUser);
      observer.complete();
    });
  }

  public logout() {
    this.currentUser$.next(null);
  }

  public getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  // --- User Administration (Admin Actions) ---
  public getUsers(): Observable<User[]> {
    return this.users$.asObservable();
  }

  public toggleBlockUser(userId: string) {
    const updated = this.users$.value.map(u => {
      if (u.id === userId) {
        return { ...u, blocked: !u.blocked };
      }
      return u;
    });
    this.users$.next(updated);
  }

  // --- Complexes Actions ---
  public getComplexes(): Observable<Complex[]> {
    return this.complexes$.asObservable();
  }

  public getApprovedComplexes(): Observable<Complex[]> {
    return this.complexes$.pipe(
      map(cplxs => cplxs.filter(c => c.status === 'approved'))
    );
  }

  public approveComplex(complexId: string) {
    const updated = this.complexes$.value.map(c => {
      if (c.id === complexId) {
        return { ...c, status: 'approved' as const };
      }
      return c;
    });
    this.complexes$.next(updated);
  }

  // --- Pitches Actions ---
  public getPitches(): Observable<Pitch[]> {
    return this.pitches$.asObservable();
  }

  public getPitchesByComplex(complexId: string): Observable<Pitch[]> {
    return this.pitches$.pipe(
      map(p => p.filter(pitch => pitch.complexId === complexId && pitch.active))
    );
  }

  public addPitch(pitch: Omit<Pitch, 'id'>) {
    const newPitch: Pitch = {
      ...pitch,
      id: `pch-${Date.now()}`
    };
    this.pitches$.next([...this.pitches$.value, newPitch]);
  }

  public updatePitch(pitch: Pitch) {
    const updated = this.pitches$.value.map(p => p.id === pitch.id ? pitch : p);
    this.pitches$.next(updated);
  }

  public deletePitch(pitchId: string) {
    const updated = this.pitches$.value.filter(p => p.id !== pitchId);
    this.pitches$.next(updated);
  }

  // --- Bookings Actions ---
  public getBookings(): Observable<Booking[]> {
    return this.bookings$.asObservable();
  }

  public getBookingsByClient(email: string): Observable<Booking[]> {
    return this.bookings$.pipe(
      map(b => b.filter(booking => booking.clientEmail.toLowerCase() === email.toLowerCase()))
    );
  }

  public getBookingsByComplex(complexId: string): Observable<Booking[]> {
    return this.bookings$.pipe(
      map(b => b.filter(booking => booking.complexId === complexId))
    );
  }

  public createBooking(booking: Omit<Booking, 'id' | 'status'>): Observable<Booking> {
    return new Observable<Booking>(observer => {
      // Check if slot is already occupied
      const occupied = this.bookings$.value.some(b =>
        b.pitchId === booking.pitchId &&
        b.date === booking.date &&
        b.timeSlot === booking.timeSlot &&
        b.status === 'active'
      );

      if (occupied) {
        observer.error('El horario ya está reservado por otra persona.');
        observer.complete();
        return;
      }

      const newBooking: Booking = {
        ...booking,
        id: `bkg-${Date.now()}`,
        status: 'active'
      };

      this.bookings$.next([...this.bookings$.value, newBooking]);

      // Automatically register a financial income transaction for the complex
      this.addTransaction({
        complexId: booking.complexId,
        type: 'income',
        description: `Reserva ${booking.pitchName} (${newBooking.timeSlot})`,
        amount: booking.price,
        date: booking.date
      });

      observer.next(newBooking);
      observer.complete();
    });
  }

  public cancelBooking(bookingId: string) {
    const booking = this.bookings$.value.find(b => b.id === bookingId);
    if (!booking) return;

    const updatedBookings = this.bookings$.value.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'cancelled' as const };
      }
      return b;
    });
    this.bookings$.next(updatedBookings);

    // Register a negative income transaction or expense to balance books
    this.addTransaction({
      complexId: booking.complexId,
      type: 'expense',
      description: `Reembolso reserva cancelada ${booking.pitchName}`,
      amount: booking.price,
      date: new Date().toISOString().split('T')[0]
    });
  }

  // --- Subscription Actions ---
  public subscribeToPro(userId: string) {
    const updatedUsers = this.users$.value.map(u => {
      if (u.id === userId) {
        return { ...u, subscription: 'pro' as const };
      }
      return u;
    });
    this.users$.next(updatedUsers);

    // Update session user
    const cur = this.currentUser$.value;
    if (cur && cur.id === userId) {
      this.currentUser$.next({ ...cur, subscription: 'pro' });
    }
  }

  // --- Transactions / Financials ---
  public getTransactionsByComplex(complexId: string): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map(tx => tx.filter(t => t.complexId === complexId))
    );
  }

  public addTransaction(tx: Omit<Transaction, 'id'>) {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    this.transactions$.next([...this.transactions$.value, newTx]);
  }

  // --- Cash Closures ---
  public getClosuresByComplex(complexId: string): Observable<CashClosure[]> {
    return this.closures$.pipe(
      map(c => c.filter(closure => closure.complexId === complexId))
    );
  }

  public doCashClosure(complexId: string, closedBy: string): Observable<CashClosure> {
    return new Observable<CashClosure>(observer => {
      const today = new Date().toISOString().split('T')[0];
      const complexTxs = this.transactions$.value.filter(t => t.complexId === complexId && t.date === today);

      // Check if closure already done for today
      const alreadyClosed = this.closures$.value.some(c => c.complexId === complexId && c.date === today);
      if (alreadyClosed) {
        observer.error('El cierre de caja para el día de hoy ya se ha realizado.');
        observer.complete();
        return;
      }

      let incomes = 0;
      let expenses = 0;

      complexTxs.forEach(t => {
        if (t.type === 'income') incomes += t.amount;
        else expenses += t.amount;
      });

      const closure: CashClosure = {
        id: `cls-${Date.now()}`,
        complexId,
        date: today,
        totalIncomes: incomes,
        totalExpenses: expenses,
        finalBalance: incomes - expenses,
        closedBy
      };

      this.closures$.next([...this.closures$.value, closure]);
      observer.next(closure);
      observer.complete();
    });
  }
}
