import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, UserProfile } from '../../auth/auth.service';
import { 
  apiComplexGetAll, 
  apiComplexUpdate,
  apiPitchGetAll, 
  apiPitchInsert, 
  apiPitchUpdate, 
  apiPitchDelete,
  apiBookingGetAll,
  apiBookingCancel,
  apiBookingInsert,
  apiTransactionGetAll,
  apiTransactionInsert,
  apiClosureGetAll,
  apiClosureInsert,
  apiUserSubscribeToPro
} from '../../api/api';
import { ResponseComplexGet, ResponsePitchGet, ResponseBookingGetAll, ResponseTransactionGet, ResponseClosureGet } from '../../api/models';
import { Observable } from 'rxjs';

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  cost: number;
  status: 'OK' | 'Bajo Stock' | 'Agotado';
}

interface ScheduleCell {
  dayIndex: number;
  dayName: string;
  date: string;
  timeSlot: string;
  status: 'Libre' | 'Ocupado' | 'Reservado';
  bookingId?: string;
  originalStatus: 'Libre' | 'Ocupado' | 'Reservado';
}

interface ScheduleRow {
  hourLabel: string;
  timeSlot: string;
  cells: ScheduleCell[];
}

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './owner.html',
  styleUrls: ['./owner.css']
})
export class OwnerDashboardComponent implements OnInit {
  currentUser: UserProfile | null = null;
  myComplex: ResponseComplexGet | null = null;
  activeSection: 'dashboard' | 'scheduler' | 'mis-canchas' | 'inventory' | 'expenses' | 'incomes' | 'closure' | 'mi-local' | 'requests' | 'historial-reservas' = 'mis-canchas';

  // Booking History Filters
  historySearchTerm = '';
  historyStatusFilter: 'all' | 'active' | 'reserved' | 'cancelled' = 'all';

  // Plan management — false = Plan Free, true = Plan Pro
  isPro = false;

  // Mi Local form fields
  complexFormName = '';
  complexFormAddress = '';
  complexFormDistrict = '';
  complexFormPhone = '';
  complexFormImage = '';
  complexFormTimeRange = '';
  complexFormActive = true;

  // State data
  myPitches: ResponsePitchGet[] = [];
  myBookings: ResponseBookingGetAll[] = [];
  myTransactions: ResponseTransactionGet[] = [];
  myClosures: ResponseClosureGet[] = [];

  // Metrics
  totalRevenue = 0;
  occupancyRate = 0;
  currentBalance = 0;
  
  todayIncomes = 0;
  todayExpenses = 0;
  todayExpensesCount = 0;
  weeklyIncomes = 0;
  
  freeHoursCount = 56;
  occupiedHoursCount = 37;
  reservedHoursCount = 12;

  expenseServiciosTotal = 0;
  expenseMantenimientoTotal = 0;
  expensePersonalTotal = 0;
  expenseEquipamientoTotal = 0;
  totalExpensesCalculated = 0;

  // Mis Canchas form
  pitchFormName = '';
  pitchFormSport: ResponsePitchGet['sport'] = 'Fútbol';
  pitchFormPricePerHour = 80;
  pitchFormImage = '';
  pitchFormActive = true;
  editingPitchId: string | null = null;

  // Inventory form
  prodName = '';
  prodCategory = 'Equipamiento';
  prodQuantity = 10;
  prodUnit = 'unidades';
  prodMinStock = 3;
  prodCost = 0.0;

  // Expenses form
  expenseDate = new Date().toISOString().split('T')[0];
  expenseCategory = 'Servicios';
  expenseDescription = '';
  txAmount = 0;

  // Incomes form
  incomeDate = new Date().toISOString().split('T')[0];
  incomeType = 'Cancha';
  incomePitchId = '—';
  incomeDescription = '';
  incomeAmount = 0;
  totalIncomesCalculated = 0;

  // Closures form
  closureDate = new Date().toISOString().split('T')[0];
  closureIncomesList: any[] = [];
  closureExpensesList: any[] = [];
  closureIncomesTotal = 0;
  closureExpensesTotal = 0;
  closureNetBalance = 0;

  // Lists
  inventoryProducts: Product[] = [
    { id: 'p-1', name: 'Balón de Fútbol', category: 'Equipamiento', quantity: 12, unit: 'unidades', minStock: 5, cost: 45, status: 'OK' },
    { id: 'p-2', name: 'Balón de Vóley', category: 'Equipamiento', quantity: 8, unit: 'unidades', minStock: 4, cost: 35, status: 'OK' },
    { id: 'p-3', name: 'Agua 500ml', category: 'Bebidas', quantity: 120, unit: 'botellas', minStock: 30, cost: 0.8, status: 'OK' },
    { id: 'p-4', name: 'Gatorade', category: 'Bebidas', quantity: 48, unit: 'botellas', minStock: 12, cost: 2.5, status: 'OK' },
    { id: 'p-5', name: 'Chaleco Peto', category: 'Equipamiento', quantity: 20, unit: 'unidades', minStock: 8, cost: 12, status: 'OK' },
    { id: 'p-6', name: 'Cal para marcar', category: 'Mantenimiento', quantity: 10, unit: 'bolsas', minStock: 3, cost: 8, status: 'OK' }
  ];
  expensesList: any[] = [];
  incomesList: any[] = [];
  latestIncomes: any[] = [];
  weeklyChartData: any[] = [];

  // Scheduler slots blocking
  selectedPitchForSchedule: ResponsePitchGet | null = null;
  weekDates: { dayName: string; date: string }[] = [];
  weekOffset = 0; // 0 = semana actual, 1 = próxima semana, etc.
  scheduleRows: ScheduleRow[] = [];

  // Manual Booking Modal State
  showManualBookingModal = false;
  manualBookingCell: ScheduleCell | null = null;
  manualClientName = '';
  manualClientEmail = '';
  manualPaymentMethod: 'Yape' | 'Plin' | 'Efectivo' = 'Efectivo';

  // Feedback Alerts
  infoMessage = '';
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUserProfile();
    if (!this.currentUser || this.currentUser.role !== 'owner') {
      this.router.navigate(['/login']);
      return;
    }
    this.loadComplexInfo();
  }

  loadComplexInfo() {
    if (!this.currentUser) return;
    apiComplexGetAll(this.http).subscribe({
      next: (complexes) => {
        // Try to find the complex by matching ownerId
        let complex = complexes.find(c => c.ownerId === this.currentUser?.id);
        
        // Fallback: search by complexId from the user profile if present
        if (!complex && this.currentUser?.complexId) {
          complex = complexes.find(c => c.id === this.currentUser?.complexId);
        }

        if (complex) {
          this.myComplex = complex;
          this.setupComplexForm();
          this.loadOwnerData();
        } else {
          this.errorMessage = 'No se encontró ningún complejo deportivo asociado a tu cuenta en el servidor. Por favor, contacta al administrador.';
        }
      },
      error: (err) => {
        console.error('Error loading complex info from server:', err);
        this.errorMessage = 'No se pudo conectar con el servidor para obtener los datos de tu local. Por favor, verifica que el backend esté en ejecución y recarga la página.';
      }
    });
  }

  setupComplexForm() {
    if (this.myComplex) {
      this.complexFormName = this.myComplex.name || '';
      this.complexFormAddress = this.myComplex.address || '';
      this.complexFormDistrict = this.myComplex.district || '';
      this.complexFormPhone = this.myComplex.phone || '';
      this.complexFormImage = this.myComplex.image || '';
      this.complexFormTimeRange = this.myComplex.timeRange || '';
      this.complexFormActive = this.myComplex.active !== false;
    }
  }

  saveComplexChanges() {
    if (!this.myComplex) return;
    
    const payload: ResponseComplexGet = {
      ...this.myComplex,
      name: this.complexFormName,
      address: this.complexFormAddress,
      district: this.complexFormDistrict,
      phone: this.complexFormPhone,
      image: this.complexFormImage,
      timeRange: this.complexFormTimeRange,
      active: this.complexFormActive
    };

    apiComplexUpdate(this.http, payload).subscribe({
      next: (response) => {
        this.myComplex = response;
        this.setupComplexForm();
        this.infoMessage = 'Los datos de tu local han sido actualizados exitosamente.';
        this.errorMessage = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => this.infoMessage = '', 4000);
      },
      error: (err) => {
        this.errorMessage = err.error?.listMessage?.[0] || 'Error al actualizar los datos del local.';
        this.infoMessage = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  getDefaultMockBookings(complexId: string): ResponseBookingGetAll[] {
    const today = new Date().toISOString().split('T')[0];
    return [
      { id: 'b-1', pitchId: 'pitch-1', complexId, date: today, timeSlot: '08:00 - 09:00', status: 'active', clientName: 'Juan Perez', price: 80, paymentMethod: 'Yape', complexName: 'Arena Vóley Club', pitchName: 'Cancha 1', sport: 'Fútbol', clientEmail: 'juan@perez.com' },
      { id: 'b-2', pitchId: 'pitch-1', complexId, date: today, timeSlot: '10:00 - 11:00', status: 'reserved', clientName: 'Carlos Gomez', price: 80, paymentMethod: 'Yape', complexName: 'Arena Vóley Club', pitchName: 'Cancha 1', sport: 'Fútbol', clientEmail: 'carlos@gomez.com' },
      { id: 'b-3', pitchId: 'pitch-2', complexId, date: today, timeSlot: '09:00 - 10:00', status: 'active', clientName: 'Roberto Ruiz', price: 80, paymentMethod: 'Yape', complexName: 'Arena Vóley Club', pitchName: 'Cancha 2', sport: 'Fútbol', clientEmail: 'roberto@ruiz.com' }
    ];
  }

  getDefaultMockTransactions(complexId: string): ResponseTransactionGet[] {
    const today = new Date().toISOString().split('T')[0];
    return [
      { id: 't-1', complexId, type: 'income', description: 'Cancha 1 — 08:00 a 09:00', amount: 80, date: today },
      { id: 't-2', complexId, type: 'income', description: 'Cancha 2 — 09:00 a 10:00', amount: 80, date: today },
      { id: 't-3', complexId, type: 'income', description: 'Tipo: Bebidas | Cancha: — | Agua y Gatorade', amount: 25, date: today },
      { id: 't-4', complexId, type: 'income', description: 'Cancha 1 — 10:00 a 12:00', amount: 160, date: today },
      { id: 't-5', complexId, type: 'expense', description: 'Servicios: Pago de luz', amount: 320, date: today },
      { id: 't-6', complexId, type: 'expense', description: 'Mantenimiento: Pintura de canchas', amount: 450, date: today }
    ];
  }

  loadOwnerData() {
    if (!this.myComplex) return;

    const complexId = this.myComplex.id;

    // Load Pitches
    apiPitchGetAll(this.http, complexId).subscribe({
      next: (pitches) => {
        this.myPitches = pitches;
        if (this.myPitches.length > 0 && !this.selectedPitchForSchedule) {
          this.selectedPitchForSchedule = this.myPitches[0];
        }
        this.loadScheduleGrid();
      },
      error: () => {
        this.myPitches = [
          { id: 'pitch-1', complexId, name: 'Cancha 1', sport: 'Fútbol', pricePerHour: 80, image: '', active: true },
          { id: 'pitch-2', complexId, name: 'Cancha 2', sport: 'Fútbol', pricePerHour: 80, image: '', active: true },
          { id: 'pitch-3', complexId, name: 'Cancha 3', sport: 'Vóley', pricePerHour: 60, image: '', active: true }
        ];
        if (this.myPitches.length > 0 && !this.selectedPitchForSchedule) {
          this.selectedPitchForSchedule = this.myPitches[0];
        }
        this.loadScheduleGrid();
      }
    });

    // Load Bookings — always from API so owner changes are reflected for clients
    apiBookingGetAll(this.http, { complexId }).subscribe({
      next: (bookings) => {
        this.myBookings = bookings;
        this.calculateMetrics();
        this.loadScheduleGrid();
      },
      error: () => {
        this.myBookings = this.getDefaultMockBookings(complexId);
        this.calculateMetrics();
        this.loadScheduleGrid();
      }
    });

    // Load Transactions
    const localTxs = localStorage.getItem('slotly_transactions');
    if (localTxs) {
      this.myTransactions = JSON.parse(localTxs);
      this.calculateMetrics();
    } else {
      apiTransactionGetAll(this.http, complexId).subscribe({
        next: (txs) => {
          this.myTransactions = [...txs].reverse();
          localStorage.setItem('slotly_transactions', JSON.stringify(this.myTransactions));
          this.calculateMetrics();
        },
        error: () => {
          this.myTransactions = this.getDefaultMockTransactions(complexId);
          localStorage.setItem('slotly_transactions', JSON.stringify(this.myTransactions));
          this.calculateMetrics();
        }
      });
    }

    // Load Closures
    const localClosures = localStorage.getItem('slotly_closures');
    if (localClosures) {
      this.myClosures = JSON.parse(localClosures);
    } else {
      apiClosureGetAll(this.http, complexId).subscribe({
        next: (cls) => {
          this.myClosures = [...cls].reverse();
          localStorage.setItem('slotly_closures', JSON.stringify(this.myClosures));
        },
        error: () => {
          this.myClosures = [];
          localStorage.setItem('slotly_closures', JSON.stringify([]));
        }
      });
    }
  }

  calculateMetrics() {
    const todayStr = new Date().toISOString().split('T')[0];
    
    let incomesToday = 0;
    let expensesToday = 0;
    let expensesTodayCount = 0;
    
    const parsedExpenses: any[] = [];
    let expServicios = 0;
    let expMantenimiento = 0;
    let expPersonal = 0;
    let expEquipamiento = 0;
    let expTotal = 0;

    const parsedIncomes: any[] = [];

    this.myTransactions.forEach(t => {
      if (t.type === 'expense') {
        const parts = t.description.split(': ');
        const category = parts.length > 1 ? parts[0] : 'Servicios';
        const desc = parts.length > 1 ? parts[1] : t.description;
        
        parsedExpenses.push({
          id: t.id,
          date: t.date,
          category,
          description: desc,
          amount: t.amount
        });

        expTotal += t.amount;
        if (category === 'Servicios') expServicios += t.amount;
        else if (category === 'Mantenimiento') expMantenimiento += t.amount;
        else if (category === 'Personal') expPersonal += t.amount;
        else if (category === 'Equipamiento') expEquipamiento += t.amount;

        if (t.date === todayStr) {
          expensesToday += t.amount;
          expensesTodayCount++;
        }
      } else {
        let desc = t.description;
        let sub = 'Cancha';
        let canchaName = '—';
        
        if (desc.startsWith('Tipo:')) {
          // Manually registered income: "Tipo: Bebidas | Cancha: — | Agua y Gatorade"
          const parts = desc.split(' | ');
          if (parts.length >= 3) {
            sub = parts[0].replace('Tipo: ', '').trim();
            canchaName = parts[1].replace('Cancha: ', '').trim();
            desc = parts[2].trim();
          }
        } else {
          // Booking-created income
          if (desc.includes('Reserva')) {
            desc = desc.replace('Reserva ', '');
          }
          if (desc.includes('Cancha 1')) canchaName = 'Cancha 1';
          else if (desc.includes('Cancha 2')) canchaName = 'Cancha 2';
          else if (desc.includes('Cancha 3')) canchaName = 'Cancha 3';
          else if (desc.includes('Cancha 4')) canchaName = 'Cancha 4';
          else if (desc.includes('Cancha 5')) canchaName = 'Cancha 5';
        }
        
        parsedIncomes.push({
          id: t.id,
          description: desc,
          date: t.date,
          sub: sub,
          canchaName: canchaName,
          amount: t.amount
        });

        if (t.date === todayStr) {
          incomesToday += t.amount;
        }
      }
    });

    this.expensesList = parsedExpenses;
    this.incomesList = parsedIncomes;
    this.latestIncomes = parsedIncomes.slice(0, 5);
    
    let totalIncomesSum = 0;
    parsedIncomes.forEach(inc => {
      totalIncomesSum += inc.amount;
    });
    this.totalIncomesCalculated = totalIncomesSum;

    this.todayIncomes = incomesToday;
    this.todayExpenses = expensesToday;
    this.todayExpensesCount = expensesTodayCount;
    this.totalRevenue = incomesToday;
    this.currentBalance = incomesToday - expensesToday;

    this.expenseServiciosTotal = expServicios;
    this.expenseMantenimientoTotal = expMantenimiento;
    this.expensePersonalTotal = expPersonal;
    this.expenseEquipamientoTotal = expEquipamiento;
    this.totalExpensesCalculated = expTotal;

    // Weekly Incomes (7 days)
    let weeklyInc = 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    this.myTransactions.forEach(t => {
      if (t.type === 'income') {
        const tDate = new Date(t.date);
        if (tDate >= oneWeekAgo) {
          weeklyInc += t.amount;
        }
      }
    });
    this.weeklyIncomes = weeklyInc;

    // Calculate slots metrics
    let free = 0;
    let occupied = 0;
    let reserved = 0;
    this.scheduleRows.forEach(row => {
      row.cells.forEach(cell => {
        if (cell.status === 'Libre') free++;
        else if (cell.status === 'Ocupado') occupied++;
        else if (cell.status === 'Reservado') reserved++;
      });
    });

    if (this.scheduleRows.length > 0) {
      this.freeHoursCount = free;
      this.occupiedHoursCount = occupied;
      this.reservedHoursCount = reserved;
    } else {
      this.freeHoursCount = 56;
      this.occupiedHoursCount = 37;
      this.reservedHoursCount = 12;
    }

    this.calculateWeeklyChartData();
    this.calculateClosureDetails();
  }

  calculateWeeklyChartData() {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    this.weeklyChartData = dayLabels.map((label, index) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + index);
      const dStr = d.toISOString().split('T')[0];

      let dayIncome = 0;
      this.myTransactions.forEach(t => {
        if (t.type === 'income' && t.date === dStr) {
          dayIncome += t.amount;
        }
      });

      // Max chart height is S/ 1000, mapped to 200px
      const height = Math.min(200, (dayIncome / 1000) * 200);

      return {
        label,
        income: dayIncome,
        height: Math.max(15, height)
      };
    });
  }

  // --- Scheduler Grid Methods ---
  calculateWeekDates() {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + this.weekOffset * 7);

    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    this.weekDates = dayNames.map((name, index) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + index);
      return {
        dayName: name,
        date: d.toISOString().split('T')[0]
      };
    });
  }

  prevWeek() {
    this.weekOffset--;
    if (this.selectedPitchForSchedule) this.loadScheduleGrid();
  }

  nextWeek() {
    this.weekOffset++;
    if (this.selectedPitchForSchedule) this.loadScheduleGrid();
  }

  resetWeek() {
    this.weekOffset = 0;
    if (this.selectedPitchForSchedule) this.loadScheduleGrid();
  }

  loadScheduleGrid() {
    if (!this.selectedPitchForSchedule || !this.myComplex) return;

    this.calculateWeekDates();

    const hours = [
      { label: '7:00 am', slot: '07:00 - 08:00' },
      { label: '8:00 am', slot: '08:00 - 09:00' },
      { label: '9:00 am', slot: '09:00 - 10:00' },
      { label: '10:00 am', slot: '10:00 - 11:00' },
      { label: '11:00 am', slot: '11:00 - 12:00' },
      { label: '12:00 pm', slot: '12:00 - 13:00' },
      { label: '1:00 pm', slot: '13:00 - 14:00' },
      { label: '2:00 pm', slot: '14:00 - 15:00' },
      { label: '3:00 pm', slot: '15:00 - 16:00' },
      { label: '4:00 pm', slot: '16:00 - 17:00' },
      { label: '5:00 pm', slot: '17:00 - 18:00' },
      { label: '6:00 pm', slot: '18:00 - 19:00' },
      { label: '7:00 pm', slot: '19:00 - 20:00' },
      { label: '8:00 pm', slot: '20:00 - 21:00' },
      { label: '9:00 pm', slot: '21:00 - 22:00' }
    ];

    const bookings = this.myBookings;
    this.scheduleRows = hours.map(h => {
      const cells = this.weekDates.map((wDate, idx) => {
        const b = bookings.find(booking => 
          booking.pitchId === this.selectedPitchForSchedule?.id &&
          booking.date === wDate.date &&
          booking.timeSlot === h.slot &&
          booking.status !== 'cancelled'
        );

        let cellStatus: 'Libre' | 'Ocupado' | 'Reservado' = 'Libre';
        if (b) {
          cellStatus = b.status === 'reserved' ? 'Reservado' : 'Ocupado';
        }

        return {
          dayIndex: idx,
          dayName: wDate.dayName,
          date: wDate.date,
          timeSlot: h.slot,
          status: cellStatus,
          bookingId: b?.id,
          originalStatus: cellStatus
        };
      });

      return {
        hourLabel: h.label,
        timeSlot: h.slot,
        cells: cells
      };
    });
    
    this.calculateMetrics();
  }

  selectPitchForGrid(pitch: ResponsePitchGet) {
    this.selectedPitchForSchedule = pitch;
    this.loadScheduleGrid();
  }

  onCellToggle(cell: ScheduleCell) {
    if (cell.status === 'Libre') {
      // Abre el formulario modal para ingreso manual de datos de cliente
      this.openManualBookingModal(cell);
    } else if (cell.status === 'Ocupado') {
      cell.status = 'Reservado';
    } else {
      cell.status = 'Libre';
    }
  }

  openManualBookingModal(cell: ScheduleCell) {
    this.manualBookingCell = cell;
    this.manualClientName = '';
    this.manualClientEmail = '';
    this.manualPaymentMethod = 'Efectivo';
    this.showManualBookingModal = true;
  }

  closeManualBookingModal() {
    this.showManualBookingModal = false;
    this.manualBookingCell = null;
  }

  confirmManualBooking() {
    if (!this.manualBookingCell || !this.selectedPitchForSchedule || !this.myComplex) return;

    if (!this.manualClientName.trim()) {
      this.errorMessage = 'Por favor ingresa el nombre del cliente.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    const newBookingData = {
      pitchId: this.selectedPitchForSchedule.id,
      complexId: this.myComplex.id,
      complexName: this.myComplex.name,
      pitchName: this.selectedPitchForSchedule.name,
      sport: this.selectedPitchForSchedule.sport,
      clientName: this.manualClientName.trim(),
      clientEmail: this.manualClientEmail.trim() || `${this.manualClientName.trim().toLowerCase().replace(/\s+/g, '.')}@manual.local`,
      date: this.manualBookingCell.date,
      timeSlot: this.manualBookingCell.timeSlot,
      price: this.selectedPitchForSchedule.pricePerHour,
      paymentMethod: (this.manualPaymentMethod === 'Efectivo' ? 'Yape' : this.manualPaymentMethod) as any,
      status: 'active' as const
    };

    apiBookingInsert(this.http, newBookingData).subscribe({
      next: (createdBooking) => {
        this.infoMessage = `¡Reserva registrada correctamente para ${this.manualClientName}!`;
        setTimeout(() => this.infoMessage = '', 4000);
        this.closeManualBookingModal();
        this.reloadBookingsAndGrid();
      },
      error: (err) => {
        console.warn('Backend offline/mock mode: registrando reserva en memoria local', err);
        const createdBooking: ResponseBookingGetAll = {
          id: `b-manual-${Date.now()}`,
          ...newBookingData
        };
        this.myBookings = [createdBooking, ...this.myBookings];
        this.infoMessage = `¡Reserva registrada correctamente para ${this.manualClientName}!`;
        setTimeout(() => this.infoMessage = '', 4000);
        this.closeManualBookingModal();
        this.loadScheduleGrid();
        this.calculateMetrics();
      }
    });
  }

  saveScheduleChanges() {
    if (!this.selectedPitchForSchedule || !this.myComplex) return;

    const cellsToInsert: ScheduleCell[] = [];
    const bookingsToCancel: string[] = [];

    this.scheduleRows.forEach(row => {
      row.cells.forEach(cell => {
        if (cell.status !== cell.originalStatus) {
          if (cell.originalStatus === 'Libre') {
            // Slot was free → now Ocupado or Reservado: insert new booking
            cellsToInsert.push(cell);
          } else if (cell.status === 'Libre') {
            // Slot was occupied/reserved → now free: cancel existing booking
            if (cell.bookingId) {
              bookingsToCancel.push(cell.bookingId);
            }
          } else {
            // Changed from one non-free state to another: cancel old, insert new
            if (cell.bookingId) {
              bookingsToCancel.push(cell.bookingId);
            }
            cellsToInsert.push(cell);
          }
        }
      });
    });

    if (bookingsToCancel.length === 0 && cellsToInsert.length === 0) {
      this.infoMessage = 'No hay cambios pendientes por guardar.';
      setTimeout(() => { this.infoMessage = ''; }, 3000);
      return;
    }

    // Track pending async operations
    let pendingOps = bookingsToCancel.length + cellsToInsert.length;
    let hasError = false;

    const onOpComplete = () => {
      pendingOps--;
      if (pendingOps === 0) {
        if (hasError) {
          this.errorMessage = 'Algunos cambios no pudieron guardarse. Verifica tu conexión.';
          setTimeout(() => { this.errorMessage = ''; }, 5000);
        } else {
          this.infoMessage = 'Cambios guardados con éxito en la base de datos.';
          setTimeout(() => { this.infoMessage = ''; }, 4000);
        }
        // Reload grid from API so both owner and client see real state
        this.reloadBookingsAndGrid();
      }
    };

    // Process cancellations via API
    bookingsToCancel.forEach(bookingId => {
      apiBookingCancel(this.http, bookingId).subscribe({
        next: () => onOpComplete(),
        error: () => { hasError = true; onOpComplete(); }
      });
    });

    // Process insertions via API
    cellsToInsert.forEach(cell => {
      const body = {
        pitchId: this.selectedPitchForSchedule!.id,
        complexId: this.myComplex!.id,
        complexName: this.myComplex!.name,
        pitchName: this.selectedPitchForSchedule!.name,
        sport: this.selectedPitchForSchedule!.sport,
        clientName: 'Reserva Presencial',
        clientEmail: this.currentUser?.email || 'owner@slotly.com',
        date: cell.date,
        timeSlot: cell.timeSlot,
        price: this.selectedPitchForSchedule!.pricePerHour,
        paymentMethod: 'Yape' as const,
        status: (cell.status === 'Reservado' ? 'reserved' : 'active') as 'active' | 'reserved'
      };

      apiBookingInsert(this.http, body).subscribe({
        next: () => onOpComplete(),
        error: () => { hasError = true; onOpComplete(); }
      });
    });
  }

  /** Reloads bookings from the API and refreshes the schedule grid */
  reloadBookingsAndGrid() {
    if (!this.myComplex) return;
    apiBookingGetAll(this.http, { complexId: this.myComplex.id }).subscribe({
      next: (bookings) => {
        this.myBookings = bookings;
        this.loadScheduleGrid();
        this.calculateMetrics();
      },
      error: () => {
        this.loadScheduleGrid();
      }
    });
  }

  // --- Mis Canchas Methods ---
  resetPitchForm() {
    this.pitchFormName = '';
    this.pitchFormSport = 'Fútbol';
    this.pitchFormPricePerHour = 80;
    this.pitchFormImage = '';
    this.pitchFormActive = true;
    this.editingPitchId = null;
  }

  savePitch() {
    if (!this.myComplex || !this.pitchFormName.trim()) {
      this.errorMessage = 'Completa el nombre de la cancha para publicarla.';
      setTimeout(() => { this.errorMessage = ''; }, 3000);
      return;
    }

    const payload: ResponsePitchGet = {
      id: this.editingPitchId ?? `pitch-${Date.now()}`,
      complexId: this.myComplex.id,
      name: this.pitchFormName.trim(),
      sport: this.pitchFormSport,
      pricePerHour: this.pitchFormPricePerHour,
      image: this.pitchFormImage || 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=400',
      active: this.pitchFormActive
    };

    if (this.editingPitchId) {
      apiPitchUpdate(this.http, payload).subscribe({
        next: () => {
          this.myPitches = this.myPitches.map(p => p.id === payload.id ? payload : p);
          this.infoMessage = 'Cancha actualizada correctamente.';
          this.resetPitchForm();
          this.loadScheduleGrid();
          setTimeout(() => { this.infoMessage = ''; }, 4000);
        },
        error: () => {
          this.myPitches = this.myPitches.map(p => p.id === payload.id ? payload : p);
          this.infoMessage = 'Cancha actualizada localmente.';
          this.resetPitchForm();
          this.loadScheduleGrid();
          setTimeout(() => { this.infoMessage = ''; }, 4000);
        }
      });
    } else {
      apiPitchInsert(this.http, {
        complexId: payload.complexId,
        name: payload.name,
        sport: payload.sport,
        pricePerHour: payload.pricePerHour,
        image: payload.image,
        active: payload.active
      }).subscribe({
        next: () => {
          this.myPitches = [...this.myPitches, payload];
          this.infoMessage = 'Cancha publicada con éxito.';
          this.resetPitchForm();
          this.loadScheduleGrid();
          setTimeout(() => { this.infoMessage = ''; }, 4000);
        },
        error: () => {
          this.myPitches = [...this.myPitches, payload];
          this.infoMessage = 'Cancha publicada localmente.';
          this.resetPitchForm();
          this.loadScheduleGrid();
          setTimeout(() => { this.infoMessage = ''; }, 4000);
        }
      });
    }
  }

  editPitch(pitch: ResponsePitchGet) {
    this.editingPitchId = pitch.id;
    this.pitchFormName = pitch.name;
    this.pitchFormSport = pitch.sport;
    this.pitchFormPricePerHour = pitch.pricePerHour;
    this.pitchFormImage = pitch.image;
    this.pitchFormActive = pitch.active;
    this.activeSection = 'mis-canchas';
  }

  deletePitch(pitchId: string) {
    if (!confirm('¿Seguro que quieres eliminar esta cancha?')) return;

    apiPitchDelete(this.http, pitchId).subscribe({
      next: () => {
        this.myPitches = this.myPitches.filter(p => p.id !== pitchId);
        if (this.selectedPitchForSchedule?.id === pitchId) {
          this.selectedPitchForSchedule = this.myPitches[0] ?? null;
        }
        this.infoMessage = 'Cancha eliminada.';
        this.loadScheduleGrid();
        setTimeout(() => { this.infoMessage = ''; }, 4000);
      },
      error: () => {
        this.myPitches = this.myPitches.filter(p => p.id !== pitchId);
        if (this.selectedPitchForSchedule?.id === pitchId) {
          this.selectedPitchForSchedule = this.myPitches[0] ?? null;
        }
        this.infoMessage = 'Cancha eliminada localmente.';
        this.loadScheduleGrid();
        setTimeout(() => { this.infoMessage = ''; }, 4000);
      }
    });
  }

  // --- Inventory Methods ---
  addProduct() {
    if (!this.prodName || this.prodQuantity < 0 || this.prodCost < 0) {
      this.errorMessage = 'Por favor complete todos los campos correctamente.';
      setTimeout(() => { this.errorMessage = ''; }, 3000);
      return;
    }

    const status = this.prodQuantity <= this.prodMinStock 
      ? (this.prodQuantity === 0 ? 'Agotado' : 'Bajo Stock') 
      : 'OK';

    const newProd: Product = {
      id: 'prod-' + Date.now(),
      name: this.prodName,
      category: this.prodCategory,
      quantity: this.prodQuantity,
      unit: this.prodUnit,
      minStock: this.prodMinStock,
      cost: this.prodCost,
      status
    };

    this.inventoryProducts = [...this.inventoryProducts, newProd];
    this.prodName = '';
    this.prodQuantity = 10;
    this.prodCost = 0;
    this.infoMessage = 'Producto agregado al inventario.';
    setTimeout(() => { this.infoMessage = ''; }, 4000);
  }

  deleteProduct(id: string) {
    if (confirm('¿Está seguro de que desea eliminar este producto del inventario?')) {
      this.inventoryProducts = this.inventoryProducts.filter(p => p.id !== id);
      this.infoMessage = 'Producto eliminado.';
      setTimeout(() => { this.infoMessage = ''; }, 4000);
    }
  }

  // --- Expenses Methods ---
  saveExpense() {
    if (!this.expenseDescription || this.txAmount <= 0 || !this.myComplex) {
      this.errorMessage = 'Complete todos los campos del gasto.';
      setTimeout(() => { this.errorMessage = ''; }, 3000);
      return;
    }

    const txId = 't-' + Date.now() + Math.floor(Math.random() * 1000);
    const newTx: ResponseTransactionGet = {
      id: txId,
      complexId: this.myComplex.id,
      type: 'expense',
      description: `${this.expenseCategory}: ${this.expenseDescription}`,
      amount: this.txAmount,
      date: this.expenseDate
    };

    this.myTransactions.unshift(newTx);
    localStorage.setItem('slotly_transactions', JSON.stringify(this.myTransactions));

    // Optional API call, ignored if backend is offline
    apiTransactionInsert(this.http, newTx).subscribe({
      next: () => {},
      error: () => {}
    });

    this.txAmount = 0;
    this.expenseDescription = '';
    this.infoMessage = 'Gasto registrado con éxito.';
    this.calculateMetrics();
    setTimeout(() => { this.infoMessage = ''; }, 4000);
  }

  deleteExpense(id: string) {
    if (confirm('¿Está seguro de que desea eliminar este gasto?')) {
      this.myTransactions = this.myTransactions.filter(t => t.id !== id);
      localStorage.setItem('slotly_transactions', JSON.stringify(this.myTransactions));
      this.calculateMetrics();
      this.infoMessage = 'Gasto eliminado.';
      setTimeout(() => { this.infoMessage = ''; }, 4000);
    }
  }

  // --- Incomes Methods ---
  saveIncome() {
    if (!this.incomeDescription || this.incomeAmount <= 0 || !this.myComplex) {
      this.errorMessage = 'Complete todos los campos del ingreso.';
      setTimeout(() => { this.errorMessage = ''; }, 3000);
      return;
    }

    const formattedDescription = `Tipo: ${this.incomeType} | Cancha: ${this.incomePitchId} | ${this.incomeDescription}`;
    const txId = 't-' + Date.now() + Math.floor(Math.random() * 1000);

    const newTx: ResponseTransactionGet = {
      id: txId,
      complexId: this.myComplex.id,
      type: 'income',
      description: formattedDescription,
      amount: this.incomeAmount,
      date: this.incomeDate
    };

    this.myTransactions.unshift(newTx);
    localStorage.setItem('slotly_transactions', JSON.stringify(this.myTransactions));

    // Optional API call, ignored if backend is offline
    apiTransactionInsert(this.http, newTx).subscribe({
      next: () => {},
      error: () => {}
    });

    this.incomeAmount = 0;
    this.incomeDescription = '';
    this.infoMessage = 'Ingreso registrado con éxito.';
    this.calculateMetrics();
    setTimeout(() => { this.infoMessage = ''; }, 4000);
  }

  deleteIncome(id: string) {
    if (confirm('¿Está seguro de que desea eliminar este ingreso?')) {
      this.myTransactions = this.myTransactions.filter(t => t.id !== id);
      localStorage.setItem('slotly_transactions', JSON.stringify(this.myTransactions));
      this.calculateMetrics();
      this.infoMessage = 'Ingreso eliminado.';
      setTimeout(() => { this.infoMessage = ''; }, 4000);
    }
  }

  // --- Closure Methods ---
  calculateClosureDetails() {
    const targetDate = this.closureDate;
    let incSum = 0;
    let expSum = 0;
    const incs: any[] = [];
    const exps: any[] = [];

    this.myTransactions.forEach(t => {
      if (t.date === targetDate) {
        if (t.type === 'income') {
          let desc = t.description;
          if (desc.startsWith('Tipo:')) {
            const parts = desc.split(' | ');
            if (parts.length >= 3) desc = parts[2].trim();
          } else if (desc.includes('Reserva')) {
            desc = desc.replace('Reserva ', '');
          }
          incs.push({ description: desc, amount: t.amount });
          incSum += t.amount;
        } else {
          const parts = t.description.split(': ');
          const desc = parts.length > 1 ? parts[1] : t.description;
          exps.push({ description: desc, amount: t.amount });
          expSum += t.amount;
        }
      }
    });

    this.closureIncomesList = incs;
    this.closureExpensesList = exps;
    this.closureIncomesTotal = incSum;
    this.closureExpensesTotal = expSum;
    this.closureNetBalance = incSum - expSum;
  }

  saveClosure() {
    if (!this.myComplex) return;
    
    const closureId = 'c-' + Date.now();
    const newClosure: ResponseClosureGet = {
      id: closureId,
      complexId: this.myComplex.id,
      date: this.closureDate,
      totalIncomes: this.closureIncomesTotal,
      totalExpenses: this.closureExpensesTotal,
      finalBalance: this.closureNetBalance,
      closedBy: this.currentUser?.name || 'Sofía Rivas'
    };

    this.myClosures.unshift(newClosure);
    localStorage.setItem('slotly_closures', JSON.stringify(this.myClosures));

    // Optional API call
    apiClosureInsert(this.http, newClosure).subscribe({
      next: () => {},
      error: () => {}
    });

    this.infoMessage = `Caja cerrada con éxito para el día ${this.closureDate}.`;
    setTimeout(() => { this.infoMessage = ''; }, 4000);
  }

  // --- Solicitudes de Reserva Methods ---
  get pendingRequests(): ResponseBookingGetAll[] {
    return this.myBookings.filter(b => b.status === 'reserved');
  }

  get pendingRequestsTotalAmount(): number {
    return this.pendingRequests.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getClientBookingCount(clientEmail: string): number {
    if (!clientEmail) return 0;
    return this.myBookings.filter(b => b.clientEmail === clientEmail && b.status !== 'cancelled').length;
  }

  deleteBookingHistoryItem(bookingId: string) {
    if (confirm('¿Deseas eliminar este registro del historial?')) {
      apiBookingCancel(this.http, bookingId).subscribe({
        next: () => {
          this.myBookings = this.myBookings.filter(b => b.id !== bookingId);
          this.loadScheduleGrid();
          this.calculateMetrics();
          this.infoMessage = 'Registro eliminado correctamente.';
          setTimeout(() => this.infoMessage = '', 3000);
        },
        error: (err) => {
          console.error('Error eliminando reserva', err);
          this.myBookings = this.myBookings.filter(b => b.id !== bookingId);
          this.loadScheduleGrid();
          this.calculateMetrics();
        }
      });
    }
  }

  clearAllBookingHistory() {
    if (this.myBookings.length === 0) return;
    if (confirm('¿Estás seguro de que deseas vaciar TODO el historial de reservas? Esta acción borrará todos los registros.')) {
      const ids = this.myBookings.map(b => b.id);
      ids.forEach(id => {
        apiBookingCancel(this.http, id).subscribe();
      });
      this.myBookings = [];
      this.loadScheduleGrid();
      this.calculateMetrics();
      this.infoMessage = 'Historial de reservas vaciado por completo.';
      setTimeout(() => this.infoMessage = '', 3000);
    }
  }
  formatRequestTime(createdAt?: string): string {
    if (!createdAt) return 'Hora desconocida';
    const d = new Date(createdAt);
    const now = new Date();
    const todayStr = now.toLocaleDateString('es-PE');
    const dateStr = d.toLocaleDateString('es-PE');
    const timeStr = d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    if (dateStr === todayStr) {
      return `hoy, ${timeStr}`;
    }
    return `${dateStr}, ${timeStr}`;
  }


  acceptBookingRequest(req: ResponseBookingGetAll) {
    apiBookingCancel(this.http, req.id).subscribe({
      next: () => {
        const body = {
          pitchId: req.pitchId,
          complexId: req.complexId,
          complexName: req.complexName,
          pitchName: req.pitchName,
          sport: req.sport,
          clientName: req.clientName,
          clientEmail: req.clientEmail,
          date: req.date,
          timeSlot: req.timeSlot,
          price: req.price,
          paymentMethod: (req.paymentMethod as any) || 'Yape',
          status: 'active' as const
        };
        apiBookingInsert(this.http, body).subscribe({
          next: () => {
            this.infoMessage = `¡Solicitud de ${req.clientName} aceptada exitosamente!`;
            setTimeout(() => { this.infoMessage = ''; }, 4000);
            this.reloadBookingsAndGrid();
          },
          error: (err) => {
            console.error('Error al aceptar solicitud', err);
          }
        });
      },
      error: (err) => {
        console.error('Error procesando aceptación', err);
      }
    });
  }

  rejectBookingRequest(reqId: string) {
    if (confirm('¿Deseas rechazar esta solicitud de reserva?')) {
      apiBookingCancel(this.http, reqId).subscribe({
        next: () => {
          this.infoMessage = 'Solicitud rechazada correctamente.';
          setTimeout(() => { this.infoMessage = ''; }, 4000);
          this.reloadBookingsAndGrid();
        },
        error: (err) => {
          console.error('Error al rechazar solicitud', err);
        }
      });
    }
  }

  getFilteredHistoryBookings(): ResponseBookingGetAll[] {
    let list = this.myBookings || [];
    if (this.historyStatusFilter !== 'all') {
      list = list.filter(b => b.status === this.historyStatusFilter);
    }
    if (this.historySearchTerm.trim()) {
      const term = this.historySearchTerm.toLowerCase();
      list = list.filter(b => 
        (b.clientName && b.clientName.toLowerCase().includes(term)) ||
        (b.clientEmail && b.clientEmail.toLowerCase().includes(term)) ||
        (b.pitchName && b.pitchName.toLowerCase().includes(term)) ||
        (b.date && b.date.includes(term))
      );
    }
    return list;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
