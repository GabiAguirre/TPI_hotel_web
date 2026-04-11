import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { EstadiaService, TipoHabitacion as TipoHabitacionApi } from '../../services/estadia.service';

interface TipoHabitacionView {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: string;
  camas: string;
  precioNoche: string;
  imagen: string;
}

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.scss']
})
export class HabitacionesComponent implements OnInit {
  tiposHabitaciones: TipoHabitacionView[] = [];
  isLoading = false;
  error = '';

  constructor(private estadiaService: EstadiaService) {}

  ngOnInit(): void {
    this.cargarTiposHabitacion();
  }

  private cargarTiposHabitacion(): void {
    this.isLoading = true;
    this.error = '';

    this.estadiaService.getTiposHabitacion().subscribe({
      next: (tipos) => {
        this.tiposHabitaciones = tipos.map((tipo) => this.mapTipoToView(tipo));
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = this.getErrorMessage(error);
        this.isLoading = false;
      }
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No hay conexion con el backend. Verifica que el servidor este activo.';
    }
    if (error.status === 401 || error.status === 403) {
      return 'Tu sesion no tiene permisos para ver habitaciones o el token es invalido.';
    }
    if (error.status === 404) {
      return 'No se encontro el endpoint de habitaciones. Revisa la configuracion del proxy.';
    }
    return 'No se pudieron cargar los tipos de habitaciones.';
  }

  private mapTipoToView(tipo: TipoHabitacionApi): TipoHabitacionView {
    const capacidad = tipo.capacidadPersonas ?? tipo.capacidad_persona ?? tipo.capacidad_personas ?? 0;
    const imagenBackend =
      tipo.url_imagen ??
      tipo.imagenUrl ??
      tipo.imagen ??
      (tipo as TipoHabitacionApi & { urlImagen?: string }).urlImagen;

    return {
      id: tipo.id ?? tipo.id_tipo_habitacion ?? 0,
      nombre: tipo.denominacion,
      descripcion: tipo.descripcion,
      capacidad: `${capacidad} personas`,
      camas: tipo.camas ?? (tipo.cantidadCamas ? `${tipo.cantidadCamas} camas` : 'No informado'),
      precioNoche: `$${tipo.precio_por_dia} USD`,
      imagen: this.normalizeImageUrl(imagenBackend, tipo.id ?? tipo.id_tipo_habitacion, tipo.denominacion)
    };
  }

  private normalizeImageUrl(url?: string, id?: number, denominacion?: string): string {
    const fromBackend = this.normalizeRawUrl(url);
    if (fromBackend) {
      return fromBackend;
    }

    const byId = this.getImagenPorId(id);
    if (byId) {
      return byId;
    }

    const byNombre = this.getImagenPorDenominacion(denominacion);
    if (byNombre) {
      return byNombre;
    }

    return this.getImagenDefault();
  }

  private normalizeRawUrl(url?: string): string | undefined {
    if (!url) {
      return undefined;
    }

    const cleaned = url.trim().replace(/\\/g, '/');
    if (!cleaned) {
      return undefined;
    }

    if (
      cleaned.startsWith('http://') ||
      cleaned.startsWith('https://') ||
      cleaned.startsWith('data:') ||
      cleaned.startsWith('blob:')
    ) {
      return cleaned;
    }

    if (cleaned.startsWith('/')) {
      return cleaned;
    }

    if (cleaned.startsWith('assets/')) {
      return `/${cleaned}`;
    }

    return cleaned;
  }

  private getImagenPorId(id?: number): string | undefined {
    const imagesById: Record<number, string> = {
      1: '/assets/images/single.png',
      2: '/assets/images/double.png',
      3: '/assets/images/twin.png',
      4: '/assets/images/triple.png',
      5: '/assets/images/family.png',
      6: '/assets/images/suite.png',
      7: '/assets/images/executive_suite.png',
      8: '/assets/images/presidential_suite.png',
    };

    if (!id) {
      return undefined;
    }

    return imagesById[id];
  }

  private getImagenPorDenominacion(denominacion?: string): string | undefined {
    if (!denominacion) {
      return undefined;
    }

    const nombre = denominacion.toLowerCase();

    if (nombre.includes('presidencial')) return '/assets/images/presidential_suite.png';
    if (nombre.includes('ejecutiva')) return '/assets/images/executive_suite.png';
    if (nombre.includes('suite')) return '/assets/images/suite.png';
    if (nombre.includes('familiar')) return '/assets/images/family.png';
    if (nombre.includes('triple')) return '/assets/images/triple.png';
    if (nombre.includes('twin')) return '/assets/images/twin.png';
    if (nombre.includes('doble')) return '/assets/images/double.png';
    if (nombre.includes('individual')) return '/assets/images/single.png';

    return undefined;
  }

  private getImagenDefault(): string {
    return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80';
  }
}
