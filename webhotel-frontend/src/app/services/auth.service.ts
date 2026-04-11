import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  tipoDoc: string;
  numDoc: number;
  sexo: string;
  fechaNacimiento: string;
  mail: string;
  telefono: number;
  usuario: string;
  tipoTarjetaCredito: string;
  numTarjetaCredito: number;
  nombre: string;
  apellido: string;
  password: string;

  // Compatibilidad con backend actual
  email: string;
  dni: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'webhotel_token';

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth/authenticate', credentials)
      .pipe(tap((response) => this.setToken(response.token)));
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth/register', payload)
      .pipe(tap((response) => this.setToken(response.token)));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserName(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['nombre'] ?? payload['sub'] ?? '';
    } catch {
      return '';
    }
  }

  getUserRol(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['rol'] ?? '';
    } catch {
      return '';
    }
  }

  isAdmin(): boolean {
    const role = this.getUserRol().toUpperCase();
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  }
}