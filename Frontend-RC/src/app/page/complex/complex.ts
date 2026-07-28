import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, UserProfile } from '../../auth/auth.service';
import { apiComplexGetAll, apiPitchGetAll } from '../../api/api';
import { ResponseComplexGet, ResponsePitchGet } from '../../api/models';

@Component({
  selector: 'app-complex',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './complex.html',
  styleUrls: ['./complex.css']
})
export class ComplexComponent implements OnInit {
  currentUser: UserProfile | null = null;
  approvedComplexes: ResponseComplexGet[] = [];
  allPitches: ResponsePitchGet[] = [];
  
  // Dynamic combined fields to support mockup features
  filteredPitches: (ResponsePitchGet & { 
    complexName: string; 
    district: string;
    address: string;
    rating: number;
    reviewsCount: number;
    pitchesCount: number;
    timeRange: string;
  })[] = [];

  // Search Filters
  searchTerm = '';
  searchSport = ''; // '' represents "Todos los deportes"

  sports = ['Fútbol', 'Vóley', 'Básquet'];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUserProfile();
    this.loadData();
  }

  loadData() {
    apiComplexGetAll(this.http, true).subscribe(complexes => {
      this.approvedComplexes = complexes;
      apiPitchGetAll(this.http).subscribe(pitches => {
        this.allPitches = pitches;
        this.applyFilters();
      });
    });
  }

  applyFilters() {
    const list: (ResponsePitchGet & { 
      complexName: string; 
      district: string;
      address: string;
      rating: number;
      reviewsCount: number;
      pitchesCount: number;
      timeRange: string;
    })[] = [];
    
    this.allPitches.forEach(pitch => {
      const complex = this.approvedComplexes.find(c => c.id === pitch.complexId);
      if (complex) {
        list.push({
          ...pitch,
          complexName: complex.name,
          district: complex.district,
          address: complex.address,
          rating: complex.rating || 4.5,
          reviewsCount: complex.reviewsCount || 50,
          pitchesCount: complex.pitchesCount || 1,
          timeRange: complex.timeRange || '08:00 am - 10:00 pm'
        });
      }
    });

    this.filteredPitches = list.filter(item => {
      const term = this.searchTerm.toLowerCase().trim();
      const matchSearch = !term || 
        item.complexName.toLowerCase().includes(term) || 
        item.district.toLowerCase().includes(term) ||
        item.address.toLowerCase().includes(term);
        
      const matchSport = !this.searchSport || item.sport === this.searchSport;
      return matchSearch && matchSport && item.active;
    });
  }

  setSportFilter(sport: string) {
    this.searchSport = sport;
    this.applyFilters();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToMyBookings() {
    this.router.navigate(['/booking']);
  }

  navigateToBooking(pitchId: string) {
    this.router.navigate(['/booking'], { queryParams: { pitchId } });
  }
}
