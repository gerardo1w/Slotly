import { TestBed } from '@angular/core/testing';
import { MockDataService, Booking, Pitch } from './mock-data.service';

describe('MockDataService', () => {
  let service: MockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [MockDataService] });
    service = TestBed.inject(MockDataService);
  });

  describe('Usuarios', () => {
    it('debería cargar usuarios iniciales al instanciarse', () => {
      service.getUsers().subscribe(users => {
        expect(users.length).toBeGreaterThan(0);
      });
    });

    it('debería encontrar un usuario con email "admin@test.com"', () => {
      service.getUsers().subscribe(users => {
        const admin = users.find(u => u.email === 'admin@test.com');
        expect(admin).toBeTruthy();
        expect(admin?.role).toBe('admin');
      });
    });

    it('toggleBlockUser() debería ejecutar la función de bloqueo sin lanzar error', () => {
      expect(() => service.toggleBlockUser('usr-1')).not.toThrow();
    });
  });

  describe('Canchas (Pitches)', () => {
    it('getPitches() debería retornar al menos una cancha', () => {
      service.getPitches().subscribe(pitches => {
        expect(pitches.length).toBeGreaterThan(0);
      });
    });

    it('getPitchesByComplex() debería filtrar canchas por complexId', () => {
      service.getPitchesByComplex('cplx-1').subscribe(pitches => {
        pitches.forEach(p => expect(p.complexId).toBe('cplx-1'));
      });
    });

    it('addPitch() debería agregar una nueva cancha', () => {
      const newPitch: Omit<Pitch, 'id'> = {
        complexId: 'cplx-1',
        name: 'Cancha Nueva Test',
        sport: 'Tenis',
        pricePerHour: 45,
        image: '',
        active: true
      };
      service.addPitch(newPitch);

      service.getPitches().subscribe(pitches => {
        const found = pitches.find(p => p.name === 'Cancha Nueva Test');
        expect(found).toBeTruthy();
      });
    });

    it('deletePitch() debería eliminar la cancha del sistema', () => {
      service.deletePitch('pch-1');
      service.getPitches().subscribe(pitches => {
        const deleted = pitches.find(p => p.id === 'pch-1');
        expect(deleted).toBeUndefined();
      });
    });
  });

  describe('Complejos (Complexes)', () => {
    it('getComplexes() debería retornar complejos iniciales', () => {
      service.getComplexes().subscribe(complexes => {
        expect(complexes.length).toBeGreaterThan(0);
      });
    });

    it('getApprovedComplexes() debería retornar solo complejos aprobados', () => {
      service.getApprovedComplexes().subscribe(complexes => {
        complexes.forEach(c => expect(c.status).toBe('approved'));
      });
    });
  });

  describe('Reservas (Bookings)', () => {
    it('getBookings() debería retornar reservas iniciales', () => {
      service.getBookings().subscribe(bookings => {
        expect(bookings.length).toBeGreaterThan(0);
      });
    });

    it('cancelBooking() debería cambiar el estado a "cancelled"', () => {
      service.cancelBooking('bkg-1');
      service.getBookings().subscribe(bookings => {
        const cancelled = bookings.find(b => b.id === 'bkg-1');
        expect(cancelled?.status).toBe('cancelled');
      });
    });

    it('getBookingsByClient() debería retornar solo reservas del email dado', () => {
      service.getBookingsByClient('cliente@test.com').subscribe(bookings => {
        bookings.forEach(b => expect(b.clientEmail.toLowerCase()).toBe('cliente@test.com'));
      });
    });
  });
});
