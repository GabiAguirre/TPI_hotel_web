import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { EstadiaService, Estadia, Servicio } from '../../services/estadia.service';

@Component({
  selector: 'app-estadias-en-curso',
  templateUrl: './estadias-en-curso.component.html',
  styleUrls: ['./estadias-en-curso.component.scss'],
})
export class EstadiasEnCursoComponent implements OnInit {
  estadias: Estadia[] = [];
  isLoading = false;
  message = '';
  isError = false;
  busqueda = '';

  get estadiasFiltradas(): Estadia[] {
    const term = this.busqueda.trim().toLowerCase();
    if (!term) return this.estadias;
    return this.estadias.filter((e) => {
      const nroHab = String(e.habitacion.nroHabitacion).toLowerCase();
      const cliente = `${e.usuario.nombre} ${e.usuario.apellido}`.toLowerCase();
      return nroHab.includes(term) || cliente.includes(term);
    });
  }

  constructor(private estadiaService: EstadiaService) {}

  ngOnInit(): void {
    this.cargarEstadias();
  }

  cargarEstadias(): void {
    this.isLoading = true;
    this.estadiaService.getEstadiasEnCurso().subscribe({
      next: (estadias) => {
        this.estadias = estadias;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.message = 'Error al cargar las estadías en curso';
        this.isError = true;
      },
    });
  }

  checkOut(id: number): void {
    this.estadiaService.checkOut(id).subscribe({
      next: (estadia) => {
        const idx = this.estadias.findIndex((e) => e.id_estadia === id);
        if (idx !== -1) this.estadias[idx] = estadia;
        this.showMessage('Check-out realizado correctamente.', false);
      },
      error: (err: HttpErrorResponse) => {
        const msg = err.error?.message ?? err.error ?? err.message ?? 'Error al realizar el check-out';
        this.showMessage(typeof msg === 'string' ? msg : 'Error al realizar el check-out', true);
      },
    });
  }

  calcularNoches(ingreso: string, egreso: string): number {
    const diff = new Date(egreso).getTime() - new Date(ingreso).getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }

  getServiciosNombres(servicios: Servicio[]): string {
    if (!servicios || servicios.length === 0) return 'Sin servicios';
    return servicios.map((s) => s.denominacion).join(', ');
  }

  private showMessage(msg: string, error: boolean): void {
    this.message = msg;
    this.isError = error;
    setTimeout(() => (this.message = ''), 4000);
  }
}
