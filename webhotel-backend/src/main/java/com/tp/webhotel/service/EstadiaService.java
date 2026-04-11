package com.tp.webhotel.service;

import com.tp.webhotel.dtos.EstadiaRequestDto;
import com.tp.webhotel.exceptions.DisponibilidadException;
import com.tp.webhotel.exceptions.EstadiaInvalidaException;
import com.tp.webhotel.model.*;
import com.tp.webhotel.repository.EstadiaRepository;
import com.tp.webhotel.repository.HabitacionRepository;
import com.tp.webhotel.repository.ServicioRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class EstadiaService {

    private final EstadiaRepository estadiaRepository;
    private final HabitacionRepository habitacionRepository;
    private final ServicioRepository servicioRepository;
    private final EmailService emailService;

    public List<Habitacion> verificarDisponibilidad(int idTipoHabitacion, Date fechaIngreso, Date fechaEgreso) {
        return habitacionRepository.findDisponibles(idTipoHabitacion, fechaIngreso, fechaEgreso);
    }

    @Transactional
    public Estadia crear(EstadiaRequestDto dto, Usuario usuario) {
        Date fechaIngreso = Date.valueOf(dto.fechaIngreso);
        Date fechaEgreso = Date.valueOf(dto.fechaEgreso);

        if (!fechaEgreso.after(fechaIngreso)) {
            throw new EstadiaInvalidaException("La fecha de egreso debe ser posterior al ingreso");
        }

        List<Habitacion> disponibles = habitacionRepository.findDisponibles(
                dto.idTipoHabitacion, fechaIngreso, fechaEgreso);

        if (disponibles.isEmpty()) {
            throw new DisponibilidadException("No hay habitaciones disponibles para las fechas seleccionadas");
        }

        Habitacion habitacion = disponibles.get(0);
        long noches = (fechaEgreso.getTime() - fechaIngreso.getTime()) / (1000L * 60 * 60 * 24);

        Estadia estadia = new Estadia();
        estadia.setFechaIngreso(fechaIngreso);
        estadia.setFechaEgreso(fechaEgreso);
        estadia.setEstado("PENDIENTE");
        estadia.setUsuario(usuario);
        estadia.setHabitacion(habitacion);

        BigDecimal precioBase = habitacion.getTipoHabitacion().getPrecioPorDia()
                .multiply(BigDecimal.valueOf(noches));
        BigDecimal precioServicios = BigDecimal.ZERO;

        if (dto.idServicios != null && !dto.idServicios.isEmpty()) {
            Set<Servicio> servicios = new HashSet<>();
            for (int idServicio : dto.idServicios) {
                Servicio s = servicioRepository.findById(idServicio)
                        .orElseThrow(() -> new EntityNotFoundException("Servicio no encontrado"));
                servicios.add(s);
                precioServicios = precioServicios.add(s.getCosto());
            }
            estadia.setServicios(servicios);
        }

        estadia.setPrecioTotal(precioBase.add(precioServicios));
        return estadiaRepository.save(estadia);
        
    }

    @Transactional
    public Estadia modificar(int id, EstadiaRequestDto dto, Usuario usuarioActual) {
        Estadia estadia = estadiaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estadía no encontrada"));

        if (!estadia.getEstado().equals("PENDIENTE")) {
            throw new EstadiaInvalidaException("Solo se pueden modificar estadías en estado PENDIENTE");
        }
        if (estadia.getUsuario().getId() != usuarioActual.getId()
                && !usuarioActual.getRol().equals(Rol.ADMIN)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sin permiso para modificar esta reserva");
        }

        Date fechaIngreso = Date.valueOf(dto.fechaIngreso);
        Date fechaEgreso = Date.valueOf(dto.fechaEgreso);

        if (!fechaEgreso.after(fechaIngreso)) {
            throw new EstadiaInvalidaException("La fecha de egreso debe ser posterior al ingreso");
        }

        boolean conflicto = estadiaRepository.countConflicto(
            estadia.getHabitacion().getNroHabitacion(), fechaIngreso, fechaEgreso, id) > 0;

        if (conflicto) {
            throw new DisponibilidadException("La habitación no está disponible para las nuevas fechas");
        }

        long noches = (fechaEgreso.getTime() - fechaIngreso.getTime()) / (1000L * 60 * 60 * 24);
        BigDecimal precioServicios = estadia.getServicios().stream()
                .map(Servicio::getCosto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal nuevoPrecio = estadia.getHabitacion().getTipoHabitacion().getPrecioPorDia()
                .multiply(BigDecimal.valueOf(noches))
                .add(precioServicios);

        estadia.setFechaIngreso(fechaIngreso);
        estadia.setFechaEgreso(fechaEgreso);
        estadia.setPrecioTotal(nuevoPrecio);
        return estadiaRepository.save(estadia);
        
    }

    public void cancelar(int id, Usuario usuarioActual) {
        Estadia estadia = estadiaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estadía no encontrada"));

        if (estadia.getUsuario().getId() != usuarioActual.getId()
                && !usuarioActual.getRol().equals(Rol.ADMIN)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sin permiso para cancelar esta reserva");
        }
        if (estadia.getEstado().equals("CANCELADA")) {
            throw new EstadiaInvalidaException("La estadía ya está cancelada");
        }

        estadia.setEstado("CANCELADA");
        estadiaRepository.save(estadia);

    }

    @Transactional
    public Estadia confirmar(int id, Usuario usuarioActual) {
        Estadia estadia = estadiaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estadía no encontrada"));

        if (!estadia.getEstado().equals("PENDIENTE")) {
            throw new EstadiaInvalidaException("Solo se pueden confirmar estadías en estado PENDIENTE");
        }

        if (estadia.getUsuario().getId() != usuarioActual.getId()
                && !usuarioActual.getRol().equals(Rol.ADMIN)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sin permiso para confirmar esta reserva");
        }

        estadia.setEstado("CONFIRMADA");
        Estadia saved = estadiaRepository.save(estadia);
        emailService.enviarConfirmacion(saved);
        return saved;
    }

    public List<Estadia> getMisEstadias(int idUsuario) {
        return estadiaRepository.findByUsuarioIdOrderByFechaIngresoDesc(idUsuario);
    }

    public List<Estadia> getAll() {
        return estadiaRepository.findAll();
    }
    public List<Estadia> getConfirmadas() {
        return estadiaRepository.findByEstado("CONFIRMADA");
    }

    public List<Estadia> getEnCurso() {
        return estadiaRepository.findByEstado("EN CURSO");
    }

    public Estadia checkIn(int id, Usuario usuarioActual) {
        Estadia estadia = estadiaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estadía no encontrada"));

        if (!usuarioActual.getRol().equals(Rol.ADMIN)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sin permiso para realizar el check-in de esta reserva");
        }
        if (estadia.getEstado().equals("CANCELADA")) {
            throw new EstadiaInvalidaException("La estadía está cancelada");
        }

        estadia.setEstado("EN CURSO");
        Estadia saved = estadiaRepository.save(estadia);

        return saved;
    }

    public Estadia checkOut(int id, Usuario usuarioActual) {
        Estadia estadia = estadiaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estadía no encontrada"));

        if (!usuarioActual.getRol().equals(Rol.ADMIN)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sin permiso para realizar el check-out de esta reserva");
        }
        if (estadia.getEstado().equals("CANCELADA")) {
            throw new EstadiaInvalidaException("La estadía está cancelada");
        }

        estadia.setEstado("FINALIZADA");
        Estadia saved = estadiaRepository.save(estadia);

        return saved;
    }
}
