import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `<div class="p-8 text-center text-gray-400">Redireccionando...</div>`
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const user = this.authService.getUserProfile();
    if (user) {
      if (user.role === 'client') {
        this.router.navigate(['/complex']);
      } else if (user.role === 'owner') {
        this.router.navigate(['/owner']);
      } else if (user.role === 'admin') {
        this.router.navigate(['/admin']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
