import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { EstadiaService, Estadia, Servicio } from '../../services/estadia.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.scss'],
})
export class MisReservasComponent implements OnInit {
  reservas: Estadia[] = [];
  isLoading = false;
  message = '';
  isError = false;

  editandoId: number | null = null;
  editFechaIngreso = '';
  editFechaEgreso = '';
  editMessage = '';
  editLoading = false;

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  get isAdmin(): boolean {
    return this.authService.getUserRol() === 'ADMIN';
  }

  constructor(
    private estadiaService: EstadiaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.isLoading = true;
    this.estadiaService.getMisEstadias().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.message = 'Error al cargar las reservas';
        this.isError = true;
      },
    });
  }

  confirmar(id: number): void {
    this.estadiaService.confirmar(id).subscribe({
      next: (estadia) => {
        const idx = this.reservas.findIndex((r) => r.id_estadia === id);
        if (idx !== -1) this.reservas[idx] = estadia;
        this.showMessage('Reserva confirmada. Se enviará un mail de confirmación.', false);
      },
      error: (err: HttpErrorResponse) => {
        const msg = err.error?.message ?? err.error ?? err.message ?? 'Error al confirmar la reserva';
        this.showMessage(typeof msg === 'string' ? msg : 'Error al confirmar la reserva', true);
      },
    });
  }

  cancelar(id: number): void {
    if (!confirm('¿Estás seguro de que querés cancelar esta reserva?')) return;
    this.estadiaService.cancelar(id).subscribe({
      next: () => {
        const idx = this.reservas.findIndex((r) => r.id_estadia === id);
        if (idx !== -1) this.reservas[idx] = { ...this.reservas[idx], estado: 'CANCELADA' };
        this.showMessage('Reserva cancelada', false);
      },
      error: () => this.showMessage('Error al cancelar la reserva', true),
    });
  }

  iniciarEdicion(reserva: Estadia): void {
    this.editandoId = reserva.id_estadia;
    this.editFechaIngreso = reserva.fecha_ingreso;
    this.editFechaEgreso = reserva.fecha_egreso;
    this.editMessage = '';
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.editMessage = '';
  }

  guardarEdicion(reserva: Estadia): void {
    if (this.editFechaIngreso >= this.editFechaEgreso) {
      this.editMessage = 'La fecha de egreso debe ser posterior al ingreso';
      return;
    }
    this.editLoading = true;
    this.estadiaService
      .modificar(
        reserva.id_estadia,
        this.editFechaIngreso,
        this.editFechaEgreso,
        reserva.habitacion.tipoHabitacion.id
      )
      .subscribe({
        next: (estadia) => {
          this.editLoading = false;
          this.editandoId = null;
          const idx = this.reservas.findIndex((r) => r.id_estadia === reserva.id_estadia);
          if (idx !== -1) this.reservas[idx] = estadia;
          this.showMessage('Reserva actualizada', false);
        },
        error: (error: HttpErrorResponse) => {
          this.editLoading = false;
          this.editMessage = error.error?.message ?? 'Error al modificar la reserva';
        },
      });
  }

  calcularNoches(fi: string, fe: string): number {
    const d1 = new Date(fi + 'T00:00:00');
    const d2 = new Date(fe + 'T00:00:00');
    return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  }

  getServiciosNombres(servicios: Servicio[]): string {
    if (!servicios || servicios.length === 0) return 'Ninguno';
    return servicios.map((s) => s.denominacion).join(', ');
  }

  private showMessage(msg: string, error: boolean): void {
    this.message = msg;
    this.isError = error;
  }
}
