import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { apiUserRegister, apiPitchGetAll } from '../../api/api';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  isLogin = true;
  showPassword = false;
  email = '';
  password = '';
  confirmPassword = '';
  showConfirmPassword = false;
  name = '';
  role: 'client' | 'owner' = 'client';

  // Owner complex register data
  complexName = '';
  complexAddress = '';
  complexDistrict = '';
  complexPhone = '';

  errorMessage = '';
  successMessage = '';

  // Sport pitch counts loaded from API
  pitchCountFutbol = 0;
  pitchCountVoley = 0;
  pitchCountBasquet = 0;

  districts = ['Abancay', 'Tamburco'];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.redirectUser();
    }
    this.loadSportStats();
  }

  loadSportStats() {
    apiPitchGetAll(this.http).subscribe({
      next: (pitches) => {
        this.pitchCountFutbol  = pitches.filter(p => this.normalizeString(p.sport) === 'futbol').length;
        this.pitchCountVoley   = pitches.filter(p => this.normalizeString(p.sport) === 'voley').length;
        this.pitchCountBasquet = pitches.filter(p => this.normalizeString(p.sport) === 'basquet').length;
      },
      error: () => { /* silently ignore if API unreachable */ }
    });
  }

  private normalizeString(str: string | undefined): string {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  toggleTab() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    this.successMessage = '';
    this.confirmPassword = '';
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isLogin) {
      if (!this.email || !this.password) {
        this.errorMessage = 'Por favor complete todos los campos.';
        return;
      }

      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.redirectUser();
        },
        error: (err) => {
          this.errorMessage = this.extractErrorMessage(err) || 'Credenciales incorrectas.';
        }
      });
    } else {
      if (!this.email || !this.password || !this.name || !this.confirmPassword) {
        this.errorMessage = 'Por favor complete los campos obligatorios.';
        return;
      }
      
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }
      
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      if (this.name.length < 3 || this.name.length > 50 || !nameRegex.test(this.name)) {
        this.errorMessage = 'El nombre debe tener entre 3 y 50 caracteres y solo contener letras.';
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.errorMessage = 'Por favor ingrese un correo electrónico válido.';
        return;
      }
      
      const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (!passwordRegex.test(this.password)) {
        this.errorMessage = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.';
        return;
      }

      if (this.role === 'owner') {
        if (!this.complexName || !this.complexAddress || !this.complexDistrict || !this.complexPhone) {
          this.errorMessage = 'Por favor complete los datos de su complejo deportivo.';
          return;
        }
        if (this.complexName.length < 3 || this.complexName.length > 100) {
          this.errorMessage = 'El nombre del complejo debe tener entre 3 y 100 caracteres.';
          return;
        }
        const phoneRegex = /^9[0-9]{8}$/;
        if (!phoneRegex.test(this.complexPhone)) {
          this.errorMessage = 'El teléfono debe empezar con 9 y contener exactamente 9 dígitos.';
          return;
        }
      }

      const body = {
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
        complexData: this.role === 'owner' ? {
          name: this.complexName,
          address: this.complexAddress,
          district: this.complexDistrict,
          phone: this.complexPhone
        } : undefined
      };

      // Call API register operation
      apiUserRegister(this.http, body).subscribe({
        next: (user) => {
          const srvMsg = (user && (user as any).listMessage && (user as any).listMessage.length)
            ? (user as any).listMessage.join('; ')
            : 'Registro exitoso. ¡Inicie sesión!';
          this.successMessage = srvMsg;
          setTimeout(() => {
            this.isLogin = true;
            this.email = user.email;
            this.password = '';
            this.confirmPassword = '';
            this.errorMessage = '';
            this.successMessage = '';
          }, 2000);
        },
        error: (err) => {
          let msg = 'Error al registrar usuario.';
          if (err && err.error) {
            if (Array.isArray(err.error.listMessage)) msg = err.error.listMessage.join('; ');
            else if (typeof err.error === 'string') msg = err.error;
            else if (err.error.message) msg = err.error.message;
          }
          this.errorMessage = msg;
        }
      });
    }
  }

  private redirectUser() {
    const user = this.authService.getUserProfile();
    if (user) {
      if (user.role === 'client') {
        this.router.navigate(['/complex']);
      } else if (user.role === 'owner') {
        this.router.navigate(['/owner']);
      } else if (user.role === 'admin') {
        this.router.navigate(['/admin']);
      }
    }
  }

  private extractErrorMessage(err: any): string {
    if (!err) {
      return '';
    }
    if (typeof err === 'string') {
      return err;
    }
    if (err.error) {
      if (typeof err.error === 'string') {
        return err.error;
      }
      if (Array.isArray(err.error.listMessage)) {
        return err.error.listMessage.join('; ');
      }
      if (typeof err.error.message === 'string') {
        return err.error.message;
      }
      if (typeof err.error === 'object') {
        return JSON.stringify(err.error);
      }
    }
    if (Array.isArray(err.listMessage)) {
      return err.listMessage.join('; ');
    }
    return err.message || '';
  }
}
