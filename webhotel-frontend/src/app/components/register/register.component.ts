import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  tipoDoc = 'DNI';
  numDoc = '';
  nombre = '';
  apellido = '';
  sexo = '';
  fechaNacimiento = '';
  mail = '';
  telefono = '';
  usuario = '';
  password = '';
  tipoTarjetaCredito = '';
  numTarjetaCredito = '';
  message = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    const numDocDigits = this.onlyDigits(this.numDoc);
    const telefonoDigits = this.onlyDigits(this.telefono);
    const numTarjetaDigits = this.onlyDigits(this.numTarjetaCredito);

    const numericNumDoc = Number(numDocDigits);
    const numericTelefono = Number(telefonoDigits);
    const numericNumTarjetaCredito = Number(numTarjetaDigits);

    const mail = this.mail.trim().toLowerCase();
    const password = this.password.trim();

    if (!this.tipoDoc.trim()) {
      this.message = 'Selecciona el tipo de documento';
      return;
    }

    if (!numDocDigits || !Number.isFinite(numericNumDoc) || numericNumDoc <= 0) {
      this.message = 'Ingresa un numero de documento valido';
      return;
    }

    if (!this.nombre.trim() || !this.apellido.trim()) {
      this.message = 'Completa nombre y apellido';
      return;
    }

    if (!this.sexo.trim()) {
      this.message = 'Selecciona el sexo';
      return;
    }

    if (!this.fechaNacimiento) {
      this.message = 'Selecciona la fecha de nacimiento';
      return;
    }

    if (!mail || !mail.includes('@')) {
      this.message = 'Ingresa un mail valido';
      return;
    }

    if (!telefonoDigits || !Number.isFinite(numericTelefono) || numericTelefono <= 0) {
      this.message = 'Ingresa un telefono valido';
      return;
    }

    if (!this.usuario.trim()) {
      this.message = 'Ingresa un nombre de usuario';
      return;
    }

    if (!password || password.length < 6) {
      this.message = 'La contrasena debe tener al menos 6 caracteres';
      return;
    }

    if (!this.tipoTarjetaCredito.trim()) {
      this.message = 'Selecciona el tipo de tarjeta de credito';
      return;
    }

    if (!numTarjetaDigits || !Number.isFinite(numericNumTarjetaCredito) || numericNumTarjetaCredito <= 0) {
      this.message = 'Ingresa un numero de tarjeta de credito valido';
      return;
    }

    // Estandariza las entradas numericas antes de enviar.
    this.numDoc = numDocDigits;
    this.telefono = telefonoDigits;
    this.numTarjetaCredito = numTarjetaDigits;

    this.isLoading = true;
    this.message = 'Registrando usuario...';

    this.authService.register({
      tipoDoc: this.tipoDoc.trim(),
      numDoc: numericNumDoc,
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      sexo: this.sexo.trim(),
      fechaNacimiento: this.fechaNacimiento,
      mail,
      telefono: numericTelefono,
      usuario: this.usuario.trim(),
      password,
      tipoTarjetaCredito: this.tipoTarjetaCredito.trim(),
      numTarjetaCredito: numericNumTarjetaCredito,

      // Compatibilidad con backend previo
      email: mail,
      dni: numericNumDoc
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.message = this.getRegisterErrorMessage(error);
      }
    });
  }

  private onlyDigits(value: string): string {
    return (value ?? '').replace(/\D/g, '');
  }

  private getRegisterErrorMessage(error: HttpErrorResponse): string {
    if (error.status <= 0) {
      return 'Error de conexion';
    }

    const backendMessage = this.extractBackendMessage(error).toLowerCase();

    if (error.status === 500 && backendMessage.includes('constraint [usuarios.dni]')) {
      return 'El DNI ya esta registrado';
    }

    if (error.status === 500 && backendMessage.includes('constraint [usuarios.email]')) {
      return 'El mail ya esta registrado';
    }

    if (error.status === 500 && backendMessage.includes('constraint [usuarios.usuario]')) {
      return 'El nombre de usuario ya esta registrado';
    }

    if (error.status === 400) {
      return 'Los datos ingresados no son validos';
    }

    if (error.status === 403) {
      return 'No tienes permisos para realizar esta accion';
    }

    if (error.status === 409) {
      return 'Ya existe un usuario con esos datos';
    }

    return `No fue posible registrar (HTTP ${error.status})`;
  }

  private extractBackendMessage(error: HttpErrorResponse): string {
    if (!error.error) {
      return '';
    }

    if (typeof error.error === 'string') {
      return error.error;
    }

    if (typeof error.error.message === 'string') {
      return error.error.message;
    }

    return '';
  }
}
