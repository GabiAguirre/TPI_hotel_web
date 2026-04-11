import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const email = this.email.trim();
    const password = this.password;

    if (!email || !password.trim()) {
      this.message = 'Completa email y contraseña';
      return;
    }

    if (!email.includes('@')) {
      this.message = 'Debes iniciar sesion con el email, no con el nombre de usuario';
      return;
    }

    this.isLoading = true;
    this.message = 'Autenticando...';

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.status <= 0) {
          this.message = 'Error de conexion';
          return;
        }

        if (error.status === 403) {
          this.message = 'Credenciales invalidas. Verifica email y contrasena';
          return;
        }

        this.message = `No fue posible autenticar (HTTP ${error.status})`;
      }
    });
  }
}
