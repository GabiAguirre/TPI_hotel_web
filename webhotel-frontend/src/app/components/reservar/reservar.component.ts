import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  EstadiaService,
  TipoHabitacion,
  Habitacion,
  Servicio,
  Estadia,
} from '../../services/estadia.service';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.component.html',
  styleUrls: ['./reservar.component.scss'],
})
export class ReservarComponent implements OnInit {
  step: 1 | 2 | 3 = 1;

  tiposHabitacion: TipoHabitacion[] = [];
  serviciosDisponibles: Servicio[] = [];

  selectedTipoId: number | null = null;
  fechaIngreso = '';
  fechaEgreso = '';

  habitacionDisponible: Habitacion | null = null;
  serviciosSeleccionados = new Map<number, number>(); // id → costo
  noches = 0;
  precioBase = 0;

  reservaCreada: Estadia | null = null;
  message = '';
  isLoading = false;

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  get selectedTipo(): TipoHabitacion | undefined {
    return this.tiposHabitacion.find((t) => t.id === Number(this.selectedTipoId));
  }

  get precioServicios(): number {
    let total = 0;
    this.serviciosSeleccionados.forEach((costo) => (total += costo));
    return total;
  }

  get precioTotal(): number {
    return this.precioBase + this.precioServicios;
  }

  constructor(private estadiaService: EstadiaService, private router: Router) {}

  ngOnInit(): void {
    forkJoin({
      tipos: this.estadiaService.getTiposHabitacion(),
      servicios: this.estadiaService.getServicios(),
    }).subscribe({
      next: ({ tipos, servicios }) => {
        this.tiposHabitacion = tipos;
        this.serviciosDisponibles = servicios;
      },
    });
  }

  buscarDisponibilidad(): void {
    if (!this.selectedTipoId || !this.fechaIngreso || !this.fechaEgreso) {
      this.message = 'Completá todos los campos';
      return;
    }
    if (this.fechaIngreso >= this.fechaEgreso) {
      this.message = 'La fecha de egreso debe ser posterior al ingreso';
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.estadiaService
      .verificarDisponibilidad(Number(this.selectedTipoId), this.fechaIngreso, this.fechaEgreso)
      .subscribe({
        next: (habitaciones) => {
          this.isLoading = false;
          if (habitaciones.length === 0) {
            this.message =
              'No hay habitaciones disponibles de ese tipo para las fechas seleccionadas';
            return;
          }
          this.habitacionDisponible = habitaciones[0];
          const fi = new Date(this.fechaIngreso + 'T00:00:00');
          const fe = new Date(this.fechaEgreso + 'T00:00:00');
          this.noches = Math.round((fe.getTime() - fi.getTime()) / (1000 * 60 * 60 * 24));
          this.precioBase = this.noches * (this.habitacionDisponible.tipoHabitacion.precio_por_dia ?? 0);
          this.serviciosSeleccionados.clear();
          this.step = 2;
        },
        error: () => {
          this.isLoading = false;
          this.message = 'Error al verificar disponibilidad';
        },
      });
  }

  toggleServicio(servicio: Servicio, checked: boolean): void {
    if (checked) {
      this.serviciosSeleccionados.set(servicio.id, servicio.costo);
    } else {
      this.serviciosSeleccionados.delete(servicio.id);
    }
  }

  confirmarReserva(): void {
    if (!this.habitacionDisponible) return;
    this.isLoading = true;
    this.message = '';

    this.estadiaService
      .crear({
        idTipoHabitacion: this.habitacionDisponible.tipoHabitacion.id,
        fechaIngreso: this.fechaIngreso,
        fechaEgreso: this.fechaEgreso,
        idServicios: Array.from(this.serviciosSeleccionados.keys()),
      })
      .subscribe({
        next: (estadia) => {
          this.isLoading = false;
          this.reservaCreada = estadia;
          this.step = 3;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.message =
            error.error?.message ?? 'Error al crear la reserva';
        },
      });
  }

  volver(): void {
    this.step = 1;
    this.habitacionDisponible = null;
    this.message = '';
  }
}
