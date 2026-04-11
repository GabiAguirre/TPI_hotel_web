import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  EstadiaService,
  TipoHabitacion,
  TipoHabitacionRequest,
} from '../../services/estadia.service';

interface TipoHabitacionForm {
  denominacion: string;
  descripcion: string;
  capacidadPersonas: number;
  precio_por_dia: number;
  camas: string;
  url_imagen: string;
}

@Component({
  selector: 'app-gestion-tipos-habitacion',
  templateUrl: './gestion-tipos-habitacion.component.html',
  styleUrls: ['./gestion-tipos-habitacion.component.scss'],
})
export class GestionTiposHabitacionComponent implements OnInit {
  tiposHabitacion: TipoHabitacion[] = [];
  isLoading = false;
  isSaving = false;
  error = '';
  success = '';
  editingId: number | null = null;

  form: TipoHabitacionForm = this.getEmptyForm();

  constructor(private estadiaService: EstadiaService) {}

  ngOnInit(): void {
    this.cargarTiposHabitacion();
  }

  cargarTiposHabitacion(): void {
    this.isLoading = true;
    this.error = '';

    this.estadiaService.getTiposHabitacion().subscribe({
      next: (tipos) => {
        this.tiposHabitacion = tipos;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = this.getErrorMessage(error, 'No se pudieron cargar los tipos de habitacion.');
        this.isLoading = false;
      },
    });
  }

  guardarTipoHabitacion(): void {
    const capacidad = Number(this.form.capacidadPersonas);
    const precio = Number(this.form.precio_por_dia);

    if (!this.form.denominacion.trim() || !this.form.descripcion.trim()) {
      this.error = 'Denominacion y descripcion son obligatorias.';
      return;
    }

    if (!Number.isFinite(capacidad) || capacidad <= 0 || !Number.isFinite(precio) || precio < 0) {
      this.error = 'Capacidad y precio deben tener valores validos.';
      return;
    }

    this.isSaving = true;
    this.error = '';
    this.success = '';

    const payload = this.buildPayload(capacidad, precio);

    const request$ = this.editingId
      ? this.estadiaService.actualizarTipoHabitacion(this.editingId, payload)
      : this.estadiaService.crearTipoHabitacion(payload);

    request$.subscribe({
      next: () => {
        this.success = this.editingId
          ? 'Tipo de habitacion actualizado correctamente.'
          : 'Tipo de habitacion creado correctamente.';
        this.cancelarEdicion();
        this.cargarTiposHabitacion();
        this.isSaving = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = this.getErrorMessage(error, 'No se pudo guardar el tipo de habitacion.');
        this.isSaving = false;
      },
    });
  }

  editarTipoHabitacion(tipo: TipoHabitacion): void {
    this.editingId = tipo.id ?? tipo.id_tipo_habitacion ?? null;
    this.error = '';
    this.success = '';

    const tipoRaw = tipo as TipoHabitacion & Record<string, unknown>;
    const capacidad = this.resolvePositiveNumber([
      tipo.capacidadPersonas,
      tipo.capacidad_persona,
      tipo.capacidad_personas,
      tipo.capacidad,
      tipo.cantidadPersonas,
      tipo.capacidadMaxima,
      tipoRaw['capacidadPersona'],
      tipoRaw['capacidad_persona'],
      tipoRaw['capacidad_personas'],
      tipoRaw['cantidadPersona'],
      tipoRaw['cantidad_persona'],
      tipoRaw['cantidad_personas'],
      tipoRaw['cantidadPersonas'],
      tipoRaw['capacidadMaxima'],
      tipoRaw['capacidad_maxima'],
    ]);

    this.form = {
      denominacion: tipo.denominacion ?? '',
      descripcion: tipo.descripcion ?? '',
      capacidadPersonas: capacidad,
      precio_por_dia: tipo.precio_por_dia ?? tipo.precioPorDia ?? 0,
      camas: tipo.camas ?? '',
      url_imagen: tipo.url_imagen ?? tipo.imagenUrl ?? tipo.imagen ?? '',
    };
  }

  eliminarTipoHabitacion(tipo: TipoHabitacion): void {
    const id = tipo.id ?? tipo.id_tipo_habitacion;
    if (!id) {
      this.error = 'No se encontro un identificador valido para eliminar.';
      return;
    }

    const confirmado = window.confirm(`¿Seguro que deseas eliminar "${tipo.denominacion}"?`);
    if (!confirmado) {
      return;
    }

    this.error = '';
    this.success = '';

    this.estadiaService.eliminarTipoHabitacion(id).subscribe({
      next: () => {
        this.success = 'Tipo de habitacion eliminado correctamente.';
        if (this.editingId === id) {
          this.cancelarEdicion();
        }
        this.cargarTiposHabitacion();
      },
      error: (error: HttpErrorResponse) => {
        this.error = this.getErrorMessage(error, 'No se pudo eliminar el tipo de habitacion.');
      },
    });
  }

  cancelarEdicion(): void {
    this.editingId = null;
    this.form = this.getEmptyForm();
  }

  private buildPayload(capacidad: number, precio: number): TipoHabitacionRequest {
    const payload: TipoHabitacionRequest = {
      denominacion: this.form.denominacion.trim(),
      descripcion: this.form.descripcion.trim(),
      capacidad: capacidad,
      capacidadMaxima: capacidad,
      capacidad_maxima: capacidad,
      capacidadPersona: capacidad,
      capacidad_persona: capacidad,
      capacidad_personas: capacidad,
      capacidadPersonas: capacidad,
      cantidadPersona: capacidad,
      cantidad_persona: capacidad,
      cantidad_personas: capacidad,
      cantidadPersonas: capacidad,
      precioPorDia: precio,
      precio_por_dia: precio,
      camas: this.form.camas.trim(),
      url_imagen: this.form.url_imagen.trim(),
    };

    if (!payload.camas) {
      delete payload.camas;
    }

    if (!payload.url_imagen) {
      delete payload.url_imagen;
    }

    return payload;
  }

  private getEmptyForm(): TipoHabitacionForm {
    return {
      denominacion: '',
      descripcion: '',
      capacidadPersonas: 1,
      precio_por_dia: 0,
      camas: '',
      url_imagen: '',
    };
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
    if (error.status === 0) {
      return 'No hay conexion con el backend.';
    }

    if (typeof error.error === 'string' && error.error.trim().length > 0) {
      return error.error;
    }

    if (error.error?.message) {
      return error.error.message;
    }

    return fallback;
  }

  private resolvePositiveNumber(candidates: unknown[]): number {
    for (const candidate of candidates) {
      const value = Number(candidate);
      if (Number.isFinite(value) && value > 0) {
        return value;
      }
    }

    return 1;
  }
}
