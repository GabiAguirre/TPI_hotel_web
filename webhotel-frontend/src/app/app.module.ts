import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
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
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ReservarComponent,
    MisReservasComponent,
    HabitacionesComponent,
    ServiciosComponent,
    GestionTiposHabitacionComponent,
    GestionServiciosComponent,
    EstadiasConfirmadasComponent,
    EstadiasEnCursoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
