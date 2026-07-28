import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, UserProfile } from '../../auth/auth.service';
import { 
  apiUserGetAll, 
  apiUserToggleBlock, 
  apiComplexGetAll, 
  apiComplexApprove, 
  apiBookingGetAll 
} from '../../api/api';
import { ResponseUserGet, ResponseComplexGet, ResponseBookingGetAll } from '../../api/models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TableModule
  ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: UserProfile | null = null;
  activeSection: 'dashboard' | 'moderation' | 'users' = 'dashboard';

  // State data
  allUsers: ResponseUserGet[] = [];
  allComplexes: ResponseComplexGet[] = [];
  allBookings: ResponseBookingGetAll[] = [];

  // Metrics Counters
  totalRegisteredUsers = 0;
  totalComplexesCount = 0;
  approvedComplexesCount = 0;
  pendingComplexesCount = 0;
  totalBookingsCount = 0;
  globalBilling = 0;

  // Alerts
  infoMessage = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUserProfile();
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.router.navigate(['/login']);
      return;
    }
    this.loadAdminData();
  }

  loadAdminData() {
    // Users list
    apiUserGetAll(this.http).subscribe(users => {
      this.allUsers = users;
      this.totalRegisteredUsers = users.length;
    });

    // Complexes list
    apiComplexGetAll(this.http).subscribe(complexes => {
      this.allComplexes = complexes;
      this.totalComplexesCount = complexes.length;
      this.approvedComplexesCount = complexes.filter(c => c.status === 'approved').length;
      this.pendingComplexesCount = complexes.filter(c => c.status === 'pending').length;
    });

    // Bookings list
    apiBookingGetAll(this.http).subscribe(bookings => {
      this.allBookings = bookings;
      this.totalBookingsCount = bookings.length;
      
      let billing = 0;
      bookings.forEach(b => {
        if (b.status === 'active') {
          billing += b.price;
        }
      });
      this.globalBilling = billing;
    });
  }

  approveComplex(complexId: string) {
    apiComplexApprove(this.http, complexId).subscribe(() => {
      this.infoMessage = 'El complejo deportivo ha sido aprobado e incorporado a la plataforma.';
      this.loadAdminData();
      setTimeout(() => { this.infoMessage = ''; }, 4000);
    });
  }

  toggleBlock(userId: string) {
    apiUserToggleBlock(this.http, userId).subscribe(() => {
      this.loadAdminData();
      const user = this.allUsers.find(u => u.id === userId);
      this.infoMessage = user?.blocked ? 'El usuario ha sido desbloqueado.' : 'El usuario ha sido bloqueado del sistema.';
      setTimeout(() => { this.infoMessage = ''; }, 4000);
    });
  }
}
