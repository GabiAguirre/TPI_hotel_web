import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface TipoHabitacion {
  id: number;
  id_tipo_habitacion?: number;
  denominacion: string;
  descripcion: string;
  capacidadPersonas: number;
  capacidad_persona?: number;
  capacidad_personas?: number;
  capacidad?: number;
  capacidadMaxima?: number;
  cantidadPersonas?: number;
  precio_por_dia: number;
  precioPorDia?: number;
  camas?: string;
  cantidadCamas?: number;
  imagen?: string;
  imagenUrl?: string;
  url_imagen?: string;
}

export interface Habitacion {
  id: number;
  nroHabitacion: number;
  tipoHabitacion: TipoHabitacion;
}

export interface Servicio {
  id: number;
  id_servicio?: number;
  denominacion: string;
  descripcion: string;
  costo: number;
  precio?: number;
  url_imagen?: string;
  imagen?: string;
  imagenUrl?: string;
}

export interface Estadia {
  id_estadia: number;
  fecha_ingreso: string;
  fecha_egreso: string;
  estado: string;
  precio_total: number;
  habitacion: Habitacion;
  servicios: Servicio[];
  usuario: { id: number; nombre: string; apellido: string; email: string };
}

export interface EstadiaRequestDto {
  idTipoHabitacion: number;
  fechaIngreso: string;
  fechaEgreso: string;
  idServicios: number[];
}

export interface TipoHabitacionRequest {
  denominacion: string;
  descripcion: string;
  capacidad?: number;
  capacidadMaxima?: number;
  capacidad_maxima?: number;
  capacidadPersona?: number;
  capacidad_persona?: number;
  capacidad_personas?: number;
  capacidadPersonas: number;
  cantidadPersona?: number;
  cantidad_persona?: number;
  cantidad_personas?: number;
  cantidadPersonas?: number;
  precioPorDia?: number;
  precio_por_dia: number;
  camas?: string;
  url_imagen?: string;
}

export interface ServicioRequest {
  denominacion: string;
  descripcion: string;
  costo: number;
  precio?: number;
  url_imagen?: string;
  imagen?: string;
  imagenUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class EstadiaService {
  constructor(private http: HttpClient) {}

  getTiposHabitacion(): Observable<TipoHabitacion[]> {
    return this.http.get<Array<TipoHabitacion & Record<string, unknown>>>('/api/tipohabitaciones').pipe(
      map((tipos) =>
        tipos.map((tipo) => {
          const capacidad = this.resolveCapacidad(tipo);
          const id = this.resolveId(tipo);
          const precio = this.resolvePrecio(tipo);
          const imagen = this.resolveImagen(tipo);

          return {
            ...tipo,
            id,
            id_tipo_habitacion: tipo.id_tipo_habitacion ?? id,
            capacidadPersonas: capacidad,
            capacidad_persona: capacidad,
            precio_por_dia: precio,
            precioPorDia: precio,
            url_imagen: tipo.url_imagen ?? imagen,
            imagenUrl: tipo.imagenUrl ?? imagen,
            imagen: tipo.imagen ?? imagen,
          };
        })
      )
    );
  }

  crearTipoHabitacion(payload: TipoHabitacionRequest): Observable<TipoHabitacion> {
    return this.http.post<TipoHabitacion>('/api/tipohabitaciones', payload);
  }

  actualizarTipoHabitacion(id: number, payload: TipoHabitacionRequest): Observable<TipoHabitacion> {
    return this.http.put<TipoHabitacion>(`/api/tipohabitaciones/${id}`, payload);
  }

  eliminarTipoHabitacion(id: number): Observable<void> {
    return this.http.delete<void>(`/api/tipohabitaciones/${id}`);
  }

  private resolveId(tipo: TipoHabitacion & Record<string, unknown>): number {
    const candidates: unknown[] = [
      tipo.id,
      tipo.id_tipo_habitacion,
      tipo['idTipoHabitacion'],
    ];

    for (const candidate of candidates) {
      const value = Number(candidate);
      if (!Number.isNaN(value) && value > 0) {
        return value;
      }
    }

    return 0;
  }

  private resolveCapacidad(tipo: TipoHabitacion & Record<string, unknown>): number {
    const candidates: unknown[] = [
      tipo.capacidadPersonas,
      tipo.capacidad_persona,
      tipo.capacidad_personas,
      tipo.capacidad,
      tipo.capacidadMaxima,
      tipo.cantidadPersonas,
      tipo['cantidad_personas'],
      tipo['capacidadpersona'],
      tipo['capacidadPersona'],
    ];

    for (const candidate of candidates) {
      const value = Number(candidate);
      if (!Number.isNaN(value) && value > 0) {
        return value;
      }
    }

    return 0;
  }

  private resolvePrecio(tipo: TipoHabitacion & Record<string, unknown>): number {
    const candidates: unknown[] = [
      tipo.precio_por_dia,
      tipo.precioPorDia,
      tipo['precioPorDia'],
      tipo['precio'],
    ];

    for (const candidate of candidates) {
      const value = Number(candidate);
      if (!Number.isNaN(value) && value >= 0) {
        return value;
      }
    }

    return 0;
  }

  private resolveImagen(tipo: TipoHabitacion & Record<string, unknown>): string | undefined {
    const candidates: unknown[] = [
      tipo.url_imagen,
      tipo.imagenUrl,
      tipo.imagen,
      tipo['urlImagen'],
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate.trim();
      }
    }

    return undefined;
  }

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Array<Servicio & Record<string, unknown>>>('/api/servicios').pipe(
      map((servicios) =>
        servicios.map((servicio) => {
          const id = this.resolveServicioId(servicio);
          const costo = this.resolveServicioCosto(servicio);
          const imagen = this.resolveServicioImagen(servicio);

          return {
            ...servicio,
            id,
            id_servicio: servicio.id_servicio ?? id,
            costo,
            precio: servicio.precio ?? costo,
            url_imagen: servicio.url_imagen ?? imagen,
            imagen: servicio.imagen ?? imagen,
            imagenUrl: servicio.imagenUrl ?? imagen,
          };
        })
      )
    );
  }

  crearServicio(payload: ServicioRequest): Observable<Servicio> {
    return this.http.post<Servicio>('/api/servicios', payload);
  }

  actualizarServicio(id: number, payload: ServicioRequest): Observable<Servicio> {
    return this.http.put<Servicio>(`/api/servicios/${id}`, payload);
  }

  eliminarServicio(id: number): Observable<void> {
    return this.http.delete<void>(`/api/servicios/${id}`);
  }

  private resolveServicioId(servicio: Servicio & Record<string, unknown>): number {
    const candidates: unknown[] = [
      servicio.id,
      servicio.id_servicio,
      servicio['idServicio'],
    ];

    for (const candidate of candidates) {
      const value = Number(candidate);
      if (!Number.isNaN(value) && value > 0) {
        return value;
      }
    }

    return 0;
  }

  private resolveServicioCosto(servicio: Servicio & Record<string, unknown>): number {
    const candidates: unknown[] = [
      servicio.costo,
      servicio.precio,
      servicio['costoServicio'],
      servicio['precioServicio'],
    ];

    for (const candidate of candidates) {
      const value = Number(candidate);
      if (!Number.isNaN(value) && value >= 0) {
        return value;
      }
    }

    return 0;
  }

  private resolveServicioImagen(servicio: Servicio & Record<string, unknown>): string | undefined {
    const candidates: unknown[] = [
      servicio.url_imagen,
      servicio.imagen,
      servicio.imagenUrl,
      servicio['urlImagen'],
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate.trim();
      }
    }

    return undefined;
  }

  verificarDisponibilidad(
    idTipoHabitacion: number,
    fechaIngreso: string,
    fechaEgreso: string
  ): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>('/api/estadias/disponibilidad', {
      params: {
        idTipoHabitacion: String(idTipoHabitacion),
        fechaIngreso,
        fechaEgreso,
      },
    });
  }

  crear(dto: EstadiaRequestDto): Observable<Estadia> {
    return this.http.post<Estadia>('/api/estadias', dto);
  }

  getMisEstadias(): Observable<Estadia[]> {
    return this.http.get<Estadia[]>('/api/estadias/mis-estadias');
  }

  getEstadiasConfirmadas(): Observable<Estadia[]> {
    return this.http.get<Estadia[]>('/api/estadias/confirmadas');
  }

  modificar(id: number, fechaIngreso: string, fechaEgreso: string, idTipoHabitacion: number): Observable<Estadia> {
    return this.http.put<Estadia>(`/api/estadias/${id}`, {
      idTipoHabitacion,
      fechaIngreso,
      fechaEgreso,
      idServicios: [],
    });
  }

  cancelar(id: number): Observable<void> {
    return this.http.patch<void>(`/api/estadias/${id}/cancelar`, {});
  }

  confirmar(id: number): Observable<Estadia> {
    return this.http.patch<Estadia>(`/api/estadias/${id}/confirmar`, {});
  }

  checkIn(id: number): Observable<Estadia> {
    return this.http.patch<Estadia>(`/api/estadias/${id}/check-in`, {});
  }

  getEstadiasEnCurso(): Observable<Estadia[]> {
    return this.http.get<Estadia[]>('/api/estadias/en-curso');
  }

  checkOut(id: number): Observable<Estadia> {
    return this.http.patch<Estadia>(`/api/estadias/${id}/check-out`, {});
  }
}
