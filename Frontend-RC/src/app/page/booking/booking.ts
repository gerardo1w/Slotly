import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, UserProfile } from '../../auth/auth.service';
import { apiPitchGetAll, apiBookingInsert, apiBookingGetAll, apiBookingCancel, apiComplexGetAll } from '../../api/api';
import { ResponsePitchGet, ResponseComplexGet, ResponseBookingGetAll } from '../../api/models';

interface ScheduleCell {
  dayIndex: number;
  dayName: string;
  date: string;
  timeSlot: string;
  status: 'Libre' | 'Ocupado' | 'Reservado' | 'Pasado';
  bookingId?: string;
}

interface ScheduleRow {
  hourLabel: string;
  timeSlot: string;
  cells: ScheduleCell[];
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent implements OnInit {
  currentUser: UserProfile | null = null;
  isHistoryMode = false;

  // Selected pitch details
  selectedPitchId: string | null = null;
  selectedPitch: ResponsePitchGet | null = null;
  selectedComplex: ResponseComplexGet | null = null;

  // Weekly Grid Structure
  weekDates: { dayName: string; date: string }[] = [];
  scheduleRows: ScheduleRow[] = [];

  // Dialog State
  selectedCell: ScheduleCell | null = null;
  bookingModalVisible = false;
  requestSuccessModalVisible = false;

  // History State
  myBookings: ResponseBookingGetAll[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUserProfile();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Load active query param
    this.route.queryParams.subscribe(params => {
      this.selectedPitchId = params['pitchId'] || null;
      if (this.selectedPitchId) {
        this.isHistoryMode = false;
        this.loadPitchDetails();
      } else {
        this.isHistoryMode = true;
        this.loadHistory();
      }
    });
  }

  loadPitchDetails() {
    if (!this.selectedPitchId) return;

    apiPitchGetAll(this.http).subscribe(pitches => {
      const pitch = pitches.find(p => p.id === this.selectedPitchId);
      if (pitch) {
        this.selectedPitch = pitch;
        apiComplexGetAll(this.http).subscribe(complexes => {
          this.selectedComplex = complexes.find(c => c.id === pitch.complexId) || null;
          this.loadScheduleGrid();
        });
      }
    });
  }

  loadHistory() {
    if (!this.currentUser) return;
    apiBookingGetAll(this.http, { clientEmail: this.currentUser.email }).subscribe(bookings => {
      this.myBookings = [...bookings].reverse();
    });
  }

  cancelBooking(bookingId: string) {
    if (confirm('¿Está seguro de que desea cancelar esta reserva?')) {
      apiBookingCancel(this.http, bookingId).subscribe({
        next: () => {
          this.loadHistory();
        },
        error: (err) => {
          console.error('Error al cancelar reserva', err);
        }
      });
    }
  }

  calculateWeekDates() {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    // Monday is index 1, Sunday is 0. Let's calculate offset to Monday
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

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

  loadScheduleGrid() {
    if (!this.selectedPitch) return;

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

    const now = new Date();
    const todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    const currentHour = now.getHours();

    apiBookingGetAll(this.http, { complexId: this.selectedPitch.complexId }).subscribe(bookings => {
      this.scheduleRows = hours.map(h => {
        // The slot START hour (e.g., '16:00 - 17:00' → start=16, end=17)
        const slotStartHour = parseInt(h.slot.split(' - ')[0].split(':')[0], 10);
        const slotEndHour   = parseInt(h.slot.split(' - ')[1].split(':')[0], 10);

        const cells = this.weekDates.map((wDate, idx) => {
          // ── 1. Is this slot date/time already in the past? ──────────────────
          const isPastDate = wDate.date < todayStr;
          const isTodayPastHour = (wDate.date === todayStr && currentHour >= slotEndHour);

          // ── 2. Find the most relevant booking for this pitch+date+slot ───────
          //    We ignore 'reserved' bookings entirely for the calendar display
          //    (they remain Libre so other users can also request the same slot).
          //    Only an ACCEPTED ('active') booking blocks the calendar visually.
          const activeBooking = bookings.find(booking =>
            booking.pitchId === this.selectedPitch?.id &&
            booking.date === wDate.date &&
            booking.timeSlot === h.slot &&
            booking.status === 'active'          // Only confirmed bookings block the slot
          );

          // ── 3. Determine visual cell status ─────────────────────────────────
          let cellStatus: 'Libre' | 'Ocupado' | 'Reservado' | 'Pasado' = 'Libre';

          if (isPastDate || isTodayPastHour) {
            // Date/time already passed → gray regardless of booking
            cellStatus = 'Pasado';
          } else if (activeBooking) {
            // Slot is today, booking is active, and the time has just arrived → Ocupado
            const isToday = wDate.date === todayStr;
            const timeHasArrived = isToday && currentHour >= slotStartHour;
            cellStatus = timeHasArrived ? 'Ocupado' : 'Reservado';
          }
          // If booking.status === 'reserved' (pending owner approval) → cellStatus stays 'Libre'

          return {
            dayIndex: idx,
            dayName: wDate.dayName,
            date: wDate.date,
            timeSlot: h.slot,
            status: cellStatus,
            bookingId: activeBooking?.id
          };
        });

        return {
          hourLabel: h.label,
          timeSlot: h.slot,
          cells: cells
        };
      });
    });
  }


  onCellClick(cell: ScheduleCell) {
    if (cell.status !== 'Libre') return; // Only free slots are clickable
    this.selectedCell = cell;
    this.bookingModalVisible = true;
  }

  confirmBookingRequest() {
    if (!this.selectedCell || !this.selectedPitch || !this.currentUser || !this.selectedComplex) return;

    const cell = this.selectedCell;
    const body = {
      pitchId: this.selectedPitch.id,
      complexId: this.selectedPitch.complexId,
      complexName: this.selectedComplex.name,
      pitchName: this.selectedPitch.name,
      sport: this.selectedPitch.sport,
      clientName: this.currentUser.name,
      clientEmail: this.currentUser.email,
      date: cell.date,
      timeSlot: cell.timeSlot,
      price: this.selectedPitch.pricePerHour,
      paymentMethod: 'Yape' as const,
      status: 'reserved' as const
    };

    apiBookingInsert(this.http, body).subscribe({
      next: () => {
        this.bookingModalVisible = false;
        this.requestSuccessModalVisible = true;
        this.selectedCell = null;
        this.loadScheduleGrid();
      },
      error: (err) => {
        console.error('Error enviando solicitud de reserva', err);
      }
    });
  }

  openGeneralWhatsApp() {
    if (!this.selectedComplex || !this.selectedPitch) return;
    const message = `Hola, deseo consultar sobre la disponibilidad de canchas de ${this.selectedPitch.sport} en ${this.selectedComplex.name}.`;
    const phone = this.selectedComplex.phone || '51987001001';
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  }

  goBack() {
    this.isHistoryMode = false;
    this.selectedPitchId = null;
    this.router.navigate(['/complex']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
