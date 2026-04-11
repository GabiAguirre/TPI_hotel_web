import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ReservarComponent } from './components/reservar/reservar.component';
import { MisReservasComponent } from './components/mis-reservas/mis-reservas.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { GestionTiposHabitacionComponent } from './components/gestion-tipos-habitacion/gestion-tipos-habitacion.component';
import { GestionServiciosComponent } from './components/gestion-servicios/gestion-servicios.component';
import { EstadiasConfirmadasComponent } from './components/estadias-confirmadas/estadias-confirmadas.component';
import { EstadiasEnCursoComponent } from './components/estadias-en-curso/estadias-en-curso.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'habitaciones', component: HabitacionesComponent },
  { path: 'admin/tipos-habitacion', component: GestionTiposHabitacionComponent, canActivate: [AdminGuard] },
  { path: 'admin/servicios', component: GestionServiciosComponent, canActivate: [AdminGuard] },
  { path: 'admin/estadias-confirmadas', component: EstadiasConfirmadasComponent, canActivate: [AdminGuard] },
  { path: 'admin/estadias-en-curso', component: EstadiasEnCursoComponent, canActivate: [AdminGuard] },
  { path: 'reservar', component: ReservarComponent, canActivate: [AuthGuard] },
  { path: 'mis-reservas', component: MisReservasComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
