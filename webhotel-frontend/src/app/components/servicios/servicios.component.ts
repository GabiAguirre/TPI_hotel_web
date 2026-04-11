import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { EstadiaService, Servicio as ServicioApi } from '../../services/estadia.service';

interface ServicioView {
  id: number;
  nombre: string;
  descripcion: string;
  costo: string;
  imagen: string;
  fallbackIntentado: boolean;
}

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  servicios: ServicioView[] = [];
  isLoading = false;
  error = '';

  constructor(private estadiaService: EstadiaService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  private cargarServicios(): void {
    this.isLoading = true;
    this.error = '';

    this.estadiaService.getServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios.map((servicio) => this.mapServicioToView(servicio));
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
      return 'Tu sesion no tiene permisos para ver los servicios o el token es invalido.';
    }
    if (error.status === 404) {
      return 'No se encontro el endpoint de servicios. Revisa la configuracion del proxy.';
    }
    return 'No se pudieron cargar los servicios.';
  }

  private mapServicioToView(servicio: ServicioApi): ServicioView {
    const id = servicio.id ?? servicio.id_servicio ?? 0;
    const imagenBackend =
      servicio.url_imagen ??
      servicio.imagenUrl ??
      servicio.imagen ??
      (servicio as ServicioApi & { urlImagen?: string }).urlImagen;

    return {
      id,
      nombre: servicio.denominacion,
      descripcion: servicio.descripcion,
      costo: `$${servicio.costo} USD`,
      imagen: this.normalizeImageUrl(imagenBackend, servicio.denominacion),
      fallbackIntentado: false
    };
  }

  onImageError(servicio: ServicioView): void {
    if (servicio.fallbackIntentado) {
      servicio.imagen = this.getImagenDefault();
      return;
    }

    servicio.fallbackIntentado = true;
    servicio.imagen = this.getImagenPorDenominacion(servicio.nombre) ?? this.getImagenDefault();
  }

  private normalizeImageUrl(url?: string, denominacion?: string): string {
    const fromBackend = this.normalizeRawUrl(url);
    if (fromBackend) {
      return fromBackend;
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

  private getImagenPorDenominacion(denominacion?: string): string | undefined {
    if (!denominacion) {
      return undefined;
    }

    const nombre = this.normalizeText(denominacion);

    if (nombre.includes('room service')) return '/assets/images/services/real/room-service.jpg';
    if (nombre.includes('biciclet')) return '/assets/images/services/real/bike-rental.jpg';
    if (nombre.includes('lavanderia') || nombre.includes('laundry')) return '/assets/images/services/real/laundry.jpg';
    if (nombre.includes('spa')) return '/assets/images/services/real/spa.jpg';
    if (nombre.includes('restaurant') || nombre.includes('restaurante')) return '/assets/images/services/real/restaurant.jpg';
    if (nombre.includes('gimnasio') || nombre.includes('gym')) return '/assets/images/services/real/gym.jpg';
    if (nombre.includes('pileta') || nombre.includes('piscina') || nombre.includes('pool')) return '/assets/images/services/real/pool.jpg';
    if (nombre.includes('wifi') || nombre.includes('internet')) return '/assets/images/services/real/wifi-premium.jpg';
    if (nombre.includes('desayuno') || nombre.includes('breakfast')) return '/assets/images/services/real/breakfast.jpg';
    if (nombre.includes('estacionamiento') || nombre.includes('parking')) return '/assets/images/services/real/parking.jpg';
    if (nombre.includes('traslado') || nombre.includes('transfer')) return '/assets/images/services/real/transfer.jpg';

    return undefined;
  }

  private normalizeText(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private getImagenDefault(): string {
    return '/assets/images/services/real/default-service.jpg';
  }
}
