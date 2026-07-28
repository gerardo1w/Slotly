import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from './auth/auth.service';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';

interface MenuOption {
  route: string;
  icon: string;
  text: string;
  active: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuModule,
    ButtonModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'Slotly';
  currentUser: UserProfile | null = null;
  menuOptions: MenuOption[] = [];

  // PrimeNG popup menu items
  profileMenuItems: MenuItem[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.buildMenu();
      this.buildProfileMenu();
    });

    // Track active route to highlight active menu option
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveMenuOption();
    });
  }

  buildMenu() {
    if (!this.currentUser) {
      this.menuOptions = [];
      return;
    }

    if (this.currentUser.role === 'client') {
      this.menuOptions = [
        { route: '/complex', icon: 'pi pi-search', text: 'Buscar Canchas', active: false },
        { route: '/booking', icon: 'pi pi-calendar', text: 'Mis Reservas', active: false }
      ];
    } else if (this.currentUser.role === 'owner') {
      this.menuOptions = [
        { route: '/owner', icon: 'pi pi-chart-bar', text: 'Panel de Control', active: false }
      ];
    } else if (this.currentUser.role === 'admin') {
      this.menuOptions = [
        { route: '/admin', icon: 'pi pi-shield', text: 'Administración', active: false }
      ];
    }
    this.updateActiveMenuOption();
  }

  updateActiveMenuOption() {
    const currentRoute = this.router.url.split('?')[0];
    this.menuOptions.forEach(opt => {
      opt.active = opt.route === currentRoute;
    });
  }

  buildProfileMenu() {
    this.profileMenuItems = [
      {
        label: this.currentUser?.name || 'Mi Perfil',
        items: [
          {
            label: 'Cerrar Sesión',
            icon: 'pi pi-power-off',
            command: () => {
              this.logout();
            }
          }
        ]
      }
    ];
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
