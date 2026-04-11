import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  EstadiaService,
  Servicio,
  ServicioRequest,
} from '../../services/estadia.service';

interface ServicioForm {
  denominacion: string;
  descripcion: string;
  costo: number;
  url_imagen: string;
}

@Component({
  selector: 'app-gestion-servicios',
  templateUrl: './gestion-servicios.component.html',
  styleUrls: ['./gestion-servicios.component.scss'],
})
export class GestionServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  isLoading = false;
  isSaving = false;
  error = '';
  success = '';
  editingId: number | null = null;

  form: ServicioForm = this.getEmptyForm();

  constructor(private estadiaService: EstadiaService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.isLoading = true;
    this.error = '';

    this.estadiaService.getServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = this.getErrorMessage(error, 'No se pudieron cargar los servicios.');
        this.isLoading = false;
      },
    });
  }

  guardarServicio(): void {
    const costo = Number(this.form.costo);

    if (!this.form.denominacion.trim() || !this.form.descripcion.trim()) {
      this.error = 'Denominacion y descripcion son obligatorias.';
      return;
    }

    if (!Number.isFinite(costo) || costo < 0) {
      this.error = 'El costo debe tener un valor valido.';
      return;
    }

    this.isSaving = true;
    this.error = '';
    this.success = '';

    const payload = this.buildPayload(costo);

    const request$ = this.editingId
      ? this.estadiaService.actualizarServicio(this.editingId, payload)
      : this.estadiaService.crearServicio(payload);

    request$.subscribe({
      next: () => {
        this.success = this.editingId
          ? 'Servicio actualizado correctamente.'
          : 'Servicio creado correctamente.';
        this.cancelarEdicion();
        this.cargarServicios();
        this.isSaving = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = this.getErrorMessage(error, 'No se pudo guardar el servicio.');
        this.isSaving = false;
      },
    });
  }

  editarServicio(servicio: Servicio): void {
    this.editingId = servicio.id ?? servicio.id_servicio ?? null;
    this.error = '';
    this.success = '';

    this.form = {
      denominacion: servicio.denominacion ?? '',
      descripcion: servicio.descripcion ?? '',
      costo: servicio.costo ?? servicio.precio ?? 0,
      url_imagen: servicio.url_imagen ?? servicio.imagen ?? servicio.imagenUrl ?? '',
    };
  }

  eliminarServicio(servicio: Servicio): void {
    const id = servicio.id ?? servicio.id_servicio;
    if (!id) {
      this.error = 'No se encontro un identificador valido para eliminar.';
      return;
    }

    const confirmado = window.confirm(`Seguro que deseas eliminar "${servicio.denominacion}"?`);
    if (!confirmado) {
      return;
    }

    this.error = '';
    this.success = '';

    this.estadiaService.eliminarServicio(id).subscribe({
      next: () => {
        this.success = 'Servicio eliminado correctamente.';
        if (this.editingId === id) {
          this.cancelarEdicion();
        }
        this.cargarServicios();
      },
      error: (error: HttpErrorResponse) => {
        this.error = this.getErrorMessage(error, 'No se pudo eliminar el servicio.');
      },
    });
  }

  cancelarEdicion(): void {
    this.editingId = null;
    this.form = this.getEmptyForm();
  }

  private buildPayload(costo: number): ServicioRequest {
    const payload: ServicioRequest = {
      denominacion: this.form.denominacion.trim(),
      descripcion: this.form.descripcion.trim(),
      costo,
      precio: costo,
      url_imagen: this.form.url_imagen.trim(),
      imagen: this.form.url_imagen.trim(),
      imagenUrl: this.form.url_imagen.trim(),
    };

    if (!payload.url_imagen) {
      delete payload.url_imagen;
      delete payload.imagen;
      delete payload.imagenUrl;
    }

    return payload;
  }

  private getEmptyForm(): ServicioForm {
    return {
      denominacion: '',
      descripcion: '',
      costo: 0,
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
}
